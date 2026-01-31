"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function markAttendanceAction(data: {
    classroomId: string; // Just for validation/context usually
    date: Date;
    records: { studentId: string; status: AttendanceStatus }[];
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
        return { success: false, error: "Unauthorized" };
    }

    const teacherId = session.user.id;

    // Get Active Academic Year
    const academicYear = await prisma.academicYear.findFirst({
        where: { status: "ACTIVE" },
    });

    if (!academicYear) {
        return { success: false, error: "No active academic year found" };
    }

    try {
        // Iterate and upsert
        // We use transaction to ensure atomicity
        await prisma.$transaction(
            data.records.map((record) =>
                prisma.attendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: record.studentId,
                            date: data.date,
                        },
                    },
                    update: {
                        status: record.status,
                        recordedById: teacherId,
                    },
                    create: {
                        studentId: record.studentId,
                        date: data.date,
                        status: record.status,
                        recordedById: teacherId,
                        academicYearId: academicYear.id,
                    },
                })
            )
        );

        revalidatePath("/teacher/attendance");
        return { success: true, message: "Attendance marked successfully" };
    } catch (error: any) {
        console.error("Attendance Error:", error);
        return { success: false, error: "Failed to mark attendance" };
    }
}

export async function publishExamResultsAction(data: {
    examId: string;
    results: { studentId: string; marksObtained: number; remarks?: string }[];
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
        return { success: false, error: "Unauthorized" };
    }

    // Check if exam is locked (optional, based on schema)
    const exam = await prisma.exam.findUnique({
        where: { id: data.examId },
    });

    if (!exam) return { success: false, error: "Exam not found" };
    if (exam.isLocked) return { success: false, error: "Exam is locked and cannot be edited" };

    try {
        await prisma.$transaction(
            data.results.map((res) =>
                prisma.examResult.upsert({
                    where: {
                        examId_studentId: {
                            examId: data.examId,
                            studentId: res.studentId,
                        },
                    },
                    update: {
                        marksObtained: res.marksObtained,
                        remarks: res.remarks,
                    },
                    create: {
                        examId: data.examId,
                        studentId: res.studentId,
                        marksObtained: res.marksObtained,
                        remarks: res.remarks,
                    },
                })
            )
        );

        revalidatePath(`/teacher/exams/${data.examId}`);
        return { success: true, message: "Results published successfully" };
    } catch (error) {
        console.error("Result Upload Error:", error);
        return { success: false, error: "Failed to upload results" };
    }
}
