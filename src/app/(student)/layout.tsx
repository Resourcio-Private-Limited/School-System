import Link from "next/link";
import { LayoutDashboard, GraduationCap, CreditCard, LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-green-700">School Portal</h1>
                    <p className="text-sm text-gray-500">Student Access</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/student" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavLink href="/student/academics" icon={<GraduationCap size={20} />} label="Academics" />
                    <NavLink href="/student/fees" icon={<CreditCard size={20} />} label="Fees & Payments" />
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            {session.user.name?.[0] || "S"}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-800">{session.user.name}</p>
                            <p className="text-xs text-gray-500">{session.user.email}</p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center space-x-3 text-red-600 p-2 hover:bg-red-50 rounded">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );
}
