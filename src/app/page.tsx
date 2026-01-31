import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, GraduationCap, Users, Shield } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    const role = session.user.role;
    if (role === "PRINCIPAL") {
      redirect("/principal");
    } else if (role === "TEACHER") {
      redirect("/teacher");
    } else if (role === "STUDENT") {
      redirect("/student");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4 text-blue-900">
          <BookOpen size={64} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">School Management System</h1>
        <p className="text-lg text-gray-600">Please select your role to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Student Card */}
        <Link href="/login/student" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Student</h2>
            <p className="text-gray-500">Access your dashboard, view grades, and check attendance.</p>
          </div>
        </Link>

        {/* Teacher Card */}
        <Link href="/login/teacher" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Users size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Teacher</h2>
            <p className="text-gray-500">Manage classes, mark attendance, and upload result.</p>
          </div>
        </Link>

        {/* Admin Card */}
        <Link href="/login/admin" className="group">
          <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Shield size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin</h2>
            <p className="text-gray-500">System configuration, user management, and reports.</p>
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-gray-400 text-sm">
        © {new Date().getFullYear()} School Management System. All rights reserved.
      </footer>
    </div>
  );
}
