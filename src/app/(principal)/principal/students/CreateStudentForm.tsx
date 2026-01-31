"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createStudentAction } from "@/actions/user-actions";

type Classroom = {
    id: string;
    name: string;
    sections: { id: string; name: string }[];
};

export default function CreateStudentForm({ classrooms }: { classrooms: Classroom[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");

    const selectedClass = classrooms.find(c => c.id === selectedClassId);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: (formData.get("email") as string) || null,
            admissionNo: formData.get("admissionNo") as string,
            joiningDate: new Date(formData.get("joiningDate") as string),
            dob: new Date(formData.get("dob") as string),
            gender: formData.get("gender") as "MALE" | "FEMALE" | "OTHER",
            fatherName: formData.get("fatherName") as string,
            motherName: formData.get("motherName") as string,
            parentContact: formData.get("parentContact") as string,
            address: formData.get("address") as string,
            nationality: formData.get("nationality") as string,
            classroomId: formData.get("classroomId") as string,
            sectionId: formData.get("sectionId") as string,
        };

        const res = await createStudentAction(data);

        if (res.success) {
            setIsOpen(false);
            // Reset form? Ideally yes or close logic does it
        } else {
            setError(res.error || "Failed to create student");
        }
        setLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
                <Plus size={20} />
                <span>Admit Student</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 sticky top-0">
                    <h2 className="text-xl font-bold text-gray-800">Admit New Student</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Full Name</label>
                            <input name="name" required className="input" placeholder="Student Name" />
                        </div>
                        <div>
                            <label className="label">Gender</label>
                            <select name="gender" className="input">
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Date of Birth</label>
                            <input name="dob" type="date" required className="input" />
                        </div>
                        <div>
                            {/* Email optional, auto-generated if empty */}
                            <label className="label">Email (Optional)</label>
                            <input name="email" type="email" className="input" placeholder="student@..." />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold text-gray-600 mb-3">Academic Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Admission No</label>
                                <input name="admissionNo" required className="input" placeholder="ADM-202X-001" />
                            </div>
                            <div>
                                <label className="label">Admission Date</label>
                                <input name="joiningDate" type="date" required className="input" defaultValue={new Date().toISOString().split('T')[0]} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="label">Classroom</label>
                                <select
                                    name="classroomId"
                                    required
                                    className="input"
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                >
                                    <option value="">Select Class</option>
                                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Section</label>
                                <select name="sectionId" required className="input" disabled={!selectedClass}>
                                    <option value="">Select Section</option>
                                    {selectedClass?.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold text-gray-600 mb-3">Parent & Contact</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Father Name</label>
                                <input name="fatherName" required className="input" />
                            </div>
                            <div>
                                <label className="label">Mother Name</label>
                                <input name="motherName" required className="input" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="label">Parent Contact</label>
                                <input name="parentContact" required className="input" placeholder="+91..." />
                            </div>
                            <div>
                                <label className="label">Nationality</label>
                                <input name="nationality" required className="input" defaultValue="Indian" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="label">Address</label>
                            <textarea name="address" required className="input h-20"></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                        >
                            {loading ? "Admitting..." : "Admit Student"}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
        .label { display: block; font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.25rem; }
        .input { width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; color: #111827; }
      `}</style>
        </div>
    );
}
