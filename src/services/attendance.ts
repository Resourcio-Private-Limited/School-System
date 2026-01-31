import { prisma } from "@/lib/prisma";
import { AcademicYearService } from "./academic-year";
import { AttendanceStatus } from "@prisma/client";

export class AttendanceService {
    static async getStudentsForClass(classroomId: string) {
        return prisma.studentProfile.findMany({
            where: { classroomId },
            include: { user: true },
            orderBy: { user: { name: 'asc' } }
        });
    }

    static async getAttendanceForDate(classroomId: string, date: Date) {
        // Start of day to End of day range
        const start = new Date(date); start.setHours(0, 0, 0, 0);
        const end = new Date(date); end.setHours(23, 59, 59, 999);

        return prisma.attendance.findMany({
            where: {
                student: { classroomId },
                date: { gte: start, lte: end }
            }
        });
    }

    static async markAttendance(
        teacherId: string,
        classroomId: string,
        date: Date,
        records: { studentId: string; status: AttendanceStatus }[]
    ) {
        const activeYear = await AcademicYearService.getActive();
        if (!activeYear) throw new Error("No active academic year found.");

        return prisma.$transaction(async (tx) => {
            for (const record of records) {
                // Upsert attendance
                // We need to find if record exists for this day. 
                // Best strategy: delete existing for this student & date, then create new? 
                // composed unique key: [studentId, date] - date includes time so exact match needed?
                // Schema says: @@unique([studentId, date]) but usually date is just YYYY-MM-DD for uniqueness.
                // Prisma Date includes time. We should normalize date to 00:00:00 UTC or Local.

                // Normalize date
                const normalizedDate = new Date(date);
                normalizedDate.setHours(0, 0, 0, 0);

                await tx.attendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: record.studentId,
                            date: normalizedDate
                        }
                    },
                    update: {
                        status: record.status,
                        recordedById: teacherId,
                    },
                    create: {
                        studentId: record.studentId,
                        date: normalizedDate,
                        status: record.status,
                        recordedById: teacherId,
                        academicYearId: activeYear.id
                    }
                });
            }
        });
    }
}
