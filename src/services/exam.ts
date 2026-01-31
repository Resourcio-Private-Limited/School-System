import { prisma } from "@/lib/prisma";
import { AcademicYearService } from "./academic-year";

export class ExamService {
    static async getExamsForClass(classroomId: string) {
        return prisma.exam.findMany({
            where: {
                subject: { classroomId }
            },
            include: {
                subject: true
            },
            orderBy: { date: 'desc' }
        });
    }

    static async createExam(data: {
        name: string;
        subjectId: string;
        totalMarks: number;
        passingMarks: number;
        date: Date;
    }) {
        const activeYear = await AcademicYearService.getActive();
        if (!activeYear) throw new Error("No active academic year.");

        return prisma.exam.create({
            data: {
                name: data.name,
                subjectId: data.subjectId,
                totalMarks: data.totalMarks,
                passingMarks: data.passingMarks,
                date: data.date,
                academicYearId: activeYear.id
            }
        });
    }

    static async getExamWithResults(examId: string) {
        return prisma.exam.findUnique({
            where: { id: examId },
            include: {
                subject: {
                    include: { classroom: true }
                },
                results: {
                    include: { student: { include: { user: true } } }
                }
            }
        });
    }

    static async updateMarks(examId: string, marks: { studentId: string; marksObtained: number; remarks?: string }[]) {
        const exam = await prisma.exam.findUnique({ where: { id: examId } });
        if (!exam) throw new Error("Exam not found");
        if (exam.isLocked) throw new Error("Exam is locked.");

        return prisma.$transaction(async (tx) => {
            for (const m of marks) {
                await tx.examResult.upsert({
                    where: {
                        examId_studentId: {
                            examId,
                            studentId: m.studentId
                        }
                    },
                    update: {
                        marksObtained: m.marksObtained,
                        remarks: m.remarks
                    },
                    create: {
                        examId,
                        studentId: m.studentId,
                        marksObtained: m.marksObtained,
                        remarks: m.remarks
                    }
                });
            }
        });
    }

    static async togglePublish(examId: string, isPublished: boolean) {
        return prisma.exam.update({
            where: { id: examId },
            data: { isPublished }
        });
    }

    static async lockExam(examId: string) {
        const exam = await prisma.exam.findUnique({ where: { id: examId } });
        // Check date logic if needed (auto-lock). Manual lock here.
        return prisma.exam.update({
            where: { id: examId },
            data: { isLocked: true }
        });
    }
}
