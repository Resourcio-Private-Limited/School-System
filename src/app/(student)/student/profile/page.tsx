"use client";

import Image from "next/image";
import Link from "next/link";
import {
    GraduationCap,
    Award,
    User,
    MapPin,
    Phone,
    Mail,
    Shield,
    Calendar,
    FileText,
    History,
    Lock
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    // Mock student data
    const studentData = {
        personal: {
            image: "/MLZS_contents/Students Stage 1.png", // Placeholder
            fullName: "Student Name",
            dob: "01/01/2010",
            gender: "Male",
            residentialAddress: "123 Main Street, City, State - 123456",
            nationality: "Indian",
            caste: "General",
            pwd: "No",
            aadharNo: "1234 5678 9012",
            primaryContact: "+91 98765 43210",
            secondaryContact: "+91 98765 43211",
            email: "student@school.com",
            identificationMark: "Mole on left cheek"
        },
        academic: {
            admissionNo: "MLZS/2020/105",
            admissionYear: "2020",
            admissionClass: "Class 6",
            dateOfAdmission: "15/04/2020",
            currentClass: "Class 10",
            currentSection: "A",
            rollNo: "ENZK001",
            passingYear: "2025",
            transportationFees: "Yes"
        }
    };

    // Helper to generate academic history
    const getAcademicHistory = () => {
        const parseClass = (cls: string) => parseInt(cls.replace(/\D/g, '')) || 0;
        const currentClassNum = parseClass(studentData.academic.currentClass);
        const admissionClassNum = parseClass(studentData.academic.admissionClass);
        const currentYear = parseInt(studentData.academic.passingYear);

        const history = [];
        // Iterate backwards from current class to admission class
        for (let i = currentClassNum; i >= admissionClassNum; i--) {
            const yearDiff = currentClassNum - i;
            const passingYear = currentYear - yearDiff;
            const session = `${passingYear - 1}-${passingYear}`;

            history.push({
                class: `Class ${i}`,
                session: session,
                highlight: i === currentClassNum // Highlight current session
            });
        }
        return history;
    };

    const academicHistory = getAcademicHistory();

    const handleDownload = (session: string, className: string) => {
        console.log(`Downloading PDF for ${className} (${session})...`);
        // Mock download action
        alert(`Requesting Marksheet PDF for ${className} (${session}).\nSuccess: Mock PDF downloaded.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* 1. Dark Hero Section (Top 40% visual weight) */}
            <div className="bg-slate-900 pt-12 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Image in Hero for Mobile / Above Card for Desktop */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-700 overflow-hidden shadow-2xl shrink-0">
                            <Image
                                src={studentData.personal.image}
                                alt="Student Photo"
                                width={160}
                                height={160}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="text-center md:text-left text-white">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{studentData.personal.fullName}</h1>
                            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-medium">
                                <span className="flex items-center gap-1">
                                    <GraduationCap size={18} className="text-blue-400" />
                                    {studentData.academic.currentClass} - {studentData.academic.currentSection}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award size={18} className="text-blue-400" />
                                    Roll No: {studentData.academic.rollNo}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User size={18} className="text-blue-400" />
                                    Adm No: {studentData.academic.admissionNo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Floating Cards (Overlap -mt-24) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 space-y-8">
                {/* Personal Details Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-blue-500">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
                                <p className="text-sm text-gray-500">Manage your personal information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                            <InfoField label="Full Name" value={studentData.personal.fullName} icon={<User size={16} />} />
                            <InfoField label="Date of Birth" value={studentData.personal.dob} icon={<Calendar size={16} />} />
                            <InfoField label="Gender" value={studentData.personal.gender} icon={<User size={16} />} />
                            <InfoField label="Nationality" value={studentData.personal.nationality} icon={<MapPin size={16} />} />
                            <InfoField label="Caste" value={studentData.personal.caste} icon={<User size={16} />} />
                            <InfoField label="Aadhar No." value={studentData.personal.aadharNo} icon={<Shield size={16} />} />
                            <InfoField label="Email ID" value={studentData.personal.email} icon={<Mail size={16} />} />
                            <InfoField label="PWD" value={studentData.personal.pwd} icon={<User size={16} />} />
                            <InfoField label="Primary Contact No." value={studentData.personal.primaryContact} icon={<Phone size={16} />} />
                            <InfoField label="Secondary Contact No." value={studentData.personal.secondaryContact} icon={<Phone size={16} />} />
                            <InfoField label="Identification Mark" value={studentData.personal.identificationMark} icon={<User size={16} />} className="md:col-span-2" />
                            <InfoField label="Residential Address" value={studentData.personal.residentialAddress} icon={<MapPin size={16} />} className="md:col-span-3" />
                        </div>
                    </div>
                </div>

                {/* Academic Details Section */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-blue-500">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Academic Details</h2>
                                <p className="text-sm text-gray-500">School records and information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <InfoField label="Admission No." value={studentData.academic.admissionNo} icon={<FileText size={16} />} />
                            <InfoField label="Admission Year" value={studentData.academic.admissionYear} icon={<Calendar size={16} />} />
                            <InfoField label="Admission Class" value={studentData.academic.admissionClass} icon={<GraduationCap size={16} />} />
                            <InfoField label="Date of Admission" value={studentData.academic.dateOfAdmission} icon={<Calendar size={16} />} />
                            <InfoField label="Current Class" value={studentData.academic.currentClass} icon={<Award size={16} />} />
                            <InfoField label="Current Section" value={studentData.academic.currentSection} icon={<Award size={16} />} />
                            <InfoField label="Roll No." value={studentData.academic.rollNo} icon={<FileText size={16} />} />
                            <InfoField label="Passing Year" value={studentData.academic.passingYear} icon={<Calendar size={16} />} />
                        </div>
                    </div>
                </div>

                {/* Academic History & Marksheets Section */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-emerald-500">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                                    <History size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Academic History & Marksheets</h2>
                                    <p className="text-sm text-gray-500">Download marksheets for all previous classes</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Class</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Session</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {academicHistory.map((record, index) => (
                                        <tr key={index} className={record.highlight ? "bg-emerald-50" : ""}>
                                            <td className="px-4 py-2 text-sm text-gray-800">{record.class}</td>
                                            <td className="px-4 py-2 text-sm text-gray-800">{record.session}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <button
                                                    onClick={() => handleDownload(record.session, record.class)}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Reset Password Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-purple-500 mb-12">
                    <div className="p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
                                <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                            </div>
                        </div>

                        <Link href="/student/profile/reset-password">
                            <button className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition-all shadow-lg hover:shadow-slate-500/30">
                                <Lock size={18} />
                                <span>Reset Password</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable component for display fields
function InfoField({ label, value, icon, className = "" }: { label: string; value: string; icon?: React.ReactNode; className?: string }) {
    return (
        <div className={`group ${className}`}>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {icon} {label}
            </label>
            <p className="text-gray-900 font-medium text-base truncate border-b border-transparent group-hover:border-gray-200 pb-1 transition-colors">
                {value}
            </p>
        </div>
    );
}
