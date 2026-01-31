import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Users, Book, Calendar } from "lucide-react";

async function getTeacherProfile(userId: string) {
    return prisma.teacherProfile.findUnique({
        where: { id: userId },
        include: {
            classTeacherOf: {
                include: { sections: true } // Though a class has sections, usually class teacher manages the whole class or specific section logic needs clarification.
                // Based on schema, Classroom has sections. Teacher is Class Teacher of a Classroom.
            },
            subjectsTaught: {
                include: { classroom: true }
            }
        }
    });
}

export default async function TeacherDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const profile = await getTeacherProfile(session.user.id);

    if (!profile) {
        return <div>Teacher profile not found. Please contact Admin.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {session.user.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Teacher Responsibility */}
                <Card className="p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Class Teacher</h2>
                            <p className="text-gray-500">Your primary class responsibility</p>
                        </div>
                    </div>
                    {profile.classTeacherOf ? (
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{profile.classTeacherOf.name}</p>
                            <p className="text-sm text-gray-600">You are responsible for attendance and general management of this class.</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Not assigned as Class Teacher for any class.</p>
                    )}
                </Card>

                {/* Subjects Taught */}
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Book size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Subjects</h2>
                            <p className="text-gray-500">Classes you teach</p>
                        </div>
                    </div>
                    {profile.subjectsTaught.length > 0 ? (
                        <div className="space-y-2">
                            {profile.subjectsTaught.map(sub => (
                                <div key={sub.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-gray-700">{sub.name}</span>
                                    <span className="text-xs font-bold bg-white border px-2 py-1 rounded text-gray-500">
                                        {sub.classroom.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No subjects assigned yet.</p>
                    )}
                </Card>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="mr-2 text-gray-500" size={20} />
                    Today's Schedule
                </h2>
                <p className="text-gray-500 text-center py-8">Timetable feature coming soon.</p>
            </div>
        </div>
    );
}
