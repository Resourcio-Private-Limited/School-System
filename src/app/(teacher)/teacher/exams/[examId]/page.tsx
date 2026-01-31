import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MarksEntrySheet from "@/components/MarksEntrySheet";
import { notFound } from "next/navigation";

export default async function ExamEntryPage({ params }: { params: Promise<{ examId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    const { examId } = await params;

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            subject: {
                include: { classroom: true }
            }
        }
    });

    if (!exam) notFound();

    // Fetch students in the classroom of the subject
    const students = await prisma.studentProfile.findMany({
        where: { classroomId: exam.subject.classroomId },
        include: { user: true },
        orderBy: { admissionNo: 'asc' }
    });

    // Fetch existing results
    const results = await prisma.examResult.findMany({
        where: { examId: examId }
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Result Entry : {exam.name}</h1>
                <p className="text-gray-500">{exam.subject.name} - {exam.subject.classroom.name}</p>
            </div>

            <MarksEntrySheet
                exam={exam}
                students={students}
                existingResults={results}
            />
        </div>
    );
}
