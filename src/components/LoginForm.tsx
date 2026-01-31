"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

interface LoginFormProps {
    title: string;
    description?: string;
    callbackUrl?: string; // Where to go after login if needed specifically
}

export default function LoginForm({ title, description }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.refresh();
                router.push("/"); // Main page handles dispatch
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border">
                <div className="flex justify-center mb-6 text-blue-900">
                    <BookOpen size={48} />
                </div>
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">{title}</h1>
                {description && <p className="text-center text-gray-500 mb-6">{description}</p>}

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // Added text-gray-900 to ensure visibility
                            className="w-full border rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="user@school.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Added text-gray-900 to ensure visibility
                            className="w-full border rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-50"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    <div className="text-center mt-4">
                        <a href="/" className="text-sm text-gray-500 hover:text-blue-600">
                            ← Back to Home
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
