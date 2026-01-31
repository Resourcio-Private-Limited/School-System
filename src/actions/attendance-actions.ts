"use server";

import { AttendanceService } from "@/services/attendance";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAttendanceAction(classroomId: string, date: Date) {
    try {
        const data = await AttendanceService.getAttendanceForDate(classroomId, date);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function markAttendanceAction(
    classroomId: string,
    date: Date,
    records: { studentId: string; status: AttendanceStatus }[]
) {
    try {
        // We need teacherId. In server action, we get it from session.
        // Wait, the service asks for teacherId. 
        // And in the client component we passed teacherId.
        // BUT strictly, we should get it from session here for security.

        // HOWEVER, for speed, assuming the teacherId passed from client is from the session prop passed down.
        // Better pattern: get session here.
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/lib/auth");
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "TEACHER") {
            return { success: false, error: "Unauthorized" };
        }

        await AttendanceService.markAttendance(session.user.id, classroomId, date, records);

        // Revalidate paths if needed, though this is mostly client-state driven for the specific date view.
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
