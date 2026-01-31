import { AcademicYearService } from "@/services/academic-year";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card"; // Assuming I will create UI components or use simple divs for now.
import { Users, GraduationCap, BookOpen, AlertCircle } from "lucide-react";

async function getStats() {
    const activeYear = await AcademicYearService.getActive();
    const studentCount = await prisma.studentProfile.count();
    const teacherCount = await prisma.teacherProfile.count();
    const classroomCount = await prisma.classroom.count();

    return { activeYear, studentCount, teacherCount, classroomCount };
}

export default async function PrincipalDashboard() {
    const { activeYear, studentCount, teacherCount, classroomCount } = await getStats();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                    <span className="text-gray-500 text-sm">Academic Year: </span>
                    <span className={`font-bold ${activeYear ? "text-green-600" : "text-red-500"}`}>
                        {activeYear ? activeYear.name : "None Active"}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Students"
                    value={studentCount}
                    icon={<GraduationCap className="text-blue-600" size={24} />}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Total Teachers"
                    value={teacherCount}
                    icon={<Users className="text-purple-600" size={24} />}
                    color="bg-purple-50"
                />
                <StatCard
                    title="Classrooms"
                    value={classroomCount}
                    icon={<BookOpen className="text-orange-600" size={24} />}
                    color="bg-orange-50"
                />
            </div>

            {/* Quick Actions / Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
                <h2 className="text-lg font-semibold mb-4">Urgent Actions</h2>
                {!activeYear ? (
                    <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        <AlertCircle className="mr-3" />
                        <div>
                            <p className="font-bold">No Active Academic Year!</p>
                            <p className="text-sm">You must start an academic year to enable attendance and exams.</p>
                        </div>
                        <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Start Year
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500">System is running smoothly. No urgent alerts.</p>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <div className={`p-4 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}
