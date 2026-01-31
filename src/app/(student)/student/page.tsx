import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { User, Bell } from "lucide-react";

async function getStudentProfile(userId: string) {
    return prisma.studentProfile.findUnique({
        where: { id: userId },
        include: {
            classroom: true,
            section: true,
        }
    });
}

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const profile = await getStudentProfile(session.user.id);

    if (!profile) {
        return <div>Student profile not found. Please contact Admin.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {session.user.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Summary */}
                <Card className="p-6 border-l-4 border-l-green-500 md:col-span-1">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
                            <p className="text-gray-500">Student Info</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Admission No:</span>
                            <span className="font-medium text-gray-900">{profile.admissionNo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Class:</span>
                            <span className="font-medium text-gray-900">{profile.classroom?.name || "N/A"} - {profile.section?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Roll No:</span>
                            <span className="font-medium text-gray-900">{profile.rollNo || "N/A"}</span>
                        </div>
                    </div>
                </Card>

                {/* Announcements / Notifications */}
                <Card className="p-6 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <Bell size={20} className="text-yellow-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Announcements</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded border border-yellow-100">
                            <h3 className="font-bold text-yellow-800 text-sm">Exam Schedule Released</h3>
                            <p className="text-xs text-yellow-700 mt-1">The mid-term exam schedule has been released. Check the Academics tab.</p>
                            <div className="text-xs text-yellow-600 mt-2 text-right">Today</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-sm">Holiday Notice</h3>
                            <p className="text-xs text-gray-600 mt-1">School will remain closed on Friday due to public holiday.</p>
                            <div className="text-xs text-gray-500 mt-2 text-right">2 days ago</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
