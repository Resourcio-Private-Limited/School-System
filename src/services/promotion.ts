import { prisma } from "@/lib/prisma";
import { AcademicYearService } from "./academic-year";

export class PromotionService {
    /**
     * Promotes all students to the next class based on `nextClassroomCode`.
     * Final year students (nextClassroomCode = null) are archived/graduated.
     * This MUST be run only when the current year is ENDED.
     */
    static async promoteStudents(currentYearId: string) {
        // 1. Validate Year Status
        const year = await prisma.academicYear.findUnique({
            where: { id: currentYearId },
        });

        if (!year || year.status !== "ENDED") {
            throw new Error("Cannot promote: Academic Year is not marked as ENDED.");
        }

        // 2. Fetch all Classrooms to map codes
        const classrooms = await prisma.classroom.findMany();
        const classroomMap = new Map(classrooms.map((c) => [c.code, c]));

        // 3. Start Transaction
        return prisma.$transaction(async (tx) => {
            // Log start
            console.log(`Starting promotion for year ${year.name}`);

            // Get all students
            const students = await tx.studentProfile.findMany({
                select: { id: true, classroomId: true, classroom: { select: { code: true } } },
            });

            let promotedCount = 0;
            let graduatedCount = 0;

            for (const student of students) {
                if (!student.classroomId || !student.classroom) continue;

                const currentCode = student.classroom.code;
                const currentClassroom = classroomMap.get(currentCode);

                if (!currentClassroom) continue;

                const nextCode = currentClassroom.nextClassroomCode;

                if (nextCode) {
                    // Find next classroom ID
                    const nextClassroom = classroomMap.get(nextCode);
                    if (nextClassroom) {
                        // Promote
                        await tx.studentProfile.update({
                            where: { id: student.id },
                            data: {
                                classroomId: nextClassroom.id,
                                sectionId: null, // Reset section, must be reassigned
                                rollNo: null,    // Reset roll no
                            },
                        });
                        promotedCount++;
                    }
                } else {
                    // Final Year (Class 12) -> Graduate
                    await tx.studentProfile.update({
                        where: { id: student.id },
                        data: {
                            classroomId: null,
                            sectionId: null,
                            rollNo: null,
                        },
                    });
                    // Ideally archive or move to Alumni table
                    graduatedCount++;
                }
            }

            // Record History
            await tx.promotionHistory.create({
                data: {
                    fromAcademicYearId: year.id,
                    toAcademicYearId: null, // Logic for "Next" year is complex here unless we pass it. 
                    // Ideally we should have created the "Upcoming" year first or pass it in.
                    // For now, listing just the FROM year action.
                    details: { promoted: promotedCount, graduated: graduatedCount },
                },
            });

            return { promotedCount, graduatedCount };
        });
    }
}
