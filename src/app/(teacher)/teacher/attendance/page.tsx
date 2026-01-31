import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AttendanceSheet from "./AttendanceSheet";

export default async function TeacherAttendancePage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    // fetch teacher profile to get class
    const teacher = await prisma.teacherProfile.findUnique({
        where: { id: session.user.id },
        include: {
            classTeacherOf: true
        }
    });

    if (!teacher || !teacher.classTeacherOf) {
        return (
            <div className="p-8 text-center bg-white rounded-xl border">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Class Attendance</h1>
                <p className="text-gray-500">You are not assigned as a Class Teacher.</p>
            </div>
        );
    }

    const classroomId = teacher.classTeacherOf.id;

    // Fetch students of this class
    const students = await prisma.studentProfile.findMany({
        where: { classroomId: classroomId },
        include: { user: true },
        orderBy: { admissionNo: 'asc' }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance: {teacher.classTeacherOf.name}</h1>
            <AttendanceSheet classroomId={classroomId} students={students} />
        </div>
    );
}
