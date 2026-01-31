"use server";

import { prisma } from "@/lib/prisma";
import { getStrictCurrentUser } from "@/lib/session";
import { can, Action, canMarkAttendance, canEnterMarks } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AttendanceSchema = z.object({
    studentId: z.string(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    date: z.string().datetime(),
});

const MarksEntrySchema = z.array(z.object({
    studentId: z.string(),
    marks: z.number().min(0),
    remarks: z.string().optional()
}));

export async function markDailyAttendance(
    classroomId: string,
    records: z.infer<typeof AttendanceSchema>[]
) {
    const user = await getStrictCurrentUser();
    if (!can(user, Action.MARK_ATTENDANCE)) {
        throw new Error("Unauthorized role");
    }

    // Strict Check: User must be class teacher of this classroom
    const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
        include: { classTeacher: true }
    });

    if (!classroom || !canMarkAttendance(user, classroom.classTeacher?.id ?? null)) {
        throw new Error("Unauthorized: You are not the class teacher");
    }

    // 24h Lock Check
    const today = new Date();
    // Assuming simple check for now, can be elaborated

    try {
        // Bulk upsert logic or transaction
        await prisma.$transaction(
            records.map(record =>
                prisma.attendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: record.studentId,
                            date: new Date(record.date)
                        }
                    },
                    update: { status: record.status, recordedById: user.id },
                    create: {
                        studentId: record.studentId,
                        date: new Date(record.date),
                        status: record.status,
                        academicYearId: "CURRENT_YEAR_ID_TODO", // Need logic to fetch active year
                        recordedById: user.id
                    }
                })
            )
        );
        revalidatePath(`/teacher/classrooms/${classroomId}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function enterExamMarks(
    examId: string,
    entries: z.infer<typeof MarksEntrySchema>
) {
    const user = await getStrictCurrentUser();
    if (!can(user, Action.ENTER_MARKS)) return { error: "Unauthorized" };

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { subject: true }
    });

    if (!exam) return { error: "Exam not found" };

    // Strict Subject Check: Teacher must teach this subject
    if (exam.subject.teacherId !== user.id) {
        return { error: "Unauthorized: You do not teach this subject" };
    }

    // Locked Check
    if (!canEnterMarks(user, exam.isLocked)) {
        return { error: "Exam is locked" };
    }

    try {
        await prisma.$transaction(
            entries.map(entry =>
                prisma.examResult.upsert({
                    where: {
                        examId_studentId: {
                            examId,
                            studentId: entry.studentId
                        }
                    },
                    update: { marksObtained: entry.marks, remarks: entry.remarks },
                    create: {
                        examId,
                        studentId: entry.studentId,
                        marksObtained: entry.marks,
                        remarks: entry.remarks
                    }
                })
            )
        );
        revalidatePath(`/teacher/exams/${examId}`);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
