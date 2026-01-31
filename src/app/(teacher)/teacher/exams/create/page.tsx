import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateExamForm from "./CreateExamForm";

export default async function CreateExamPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { id: session.user.id },
        include: {
            subjectsTaught: {
                include: { classroom: true }
            }
        }
    });

    if (!teacherProfile) return <div>Access Denied</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Exam</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <CreateExamForm subjects={teacherProfile.subjectsTaught} />
            </div>
        </div>
    );
}
