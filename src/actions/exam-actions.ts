"use server";

import { ExamService } from "@/services/exam";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createExamAction(data: {
    name: string;
    subjectId: string;
    totalMarks: number;
    passingMarks: number;
    date: Date;
}) {
    try {
        const exam = await ExamService.createExam(data);
        revalidatePath("/teacher/exams");
        return { success: true, examId: exam.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateMarksAction(
    examId: string,
    marks: { studentId: string; marksObtained: number; remarks?: string }[]
) {
    try {
        await ExamService.updateMarks(examId, marks);
        revalidatePath(`/teacher/exams/${examId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function toggleExamPublishAction(examId: string, isPublished: boolean) {
    try {
        await ExamService.togglePublish(examId, isPublished);
        revalidatePath(`/teacher/exams/${examId}`);
        revalidatePath("/teacher/exams");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function lockExamAction(examId: string) {
    try {
        await ExamService.lockExam(examId);
        revalidatePath(`/teacher/exams/${examId}`);
        revalidatePath("/teacher/exams");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
