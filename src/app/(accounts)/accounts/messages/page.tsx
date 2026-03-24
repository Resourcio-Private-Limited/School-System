"use client";

import { useState } from "react";
import { ArrowLeft, Search, Paperclip } from "lucide-react";
import Link from "next/link";

export default function AccountantMessages() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);

    const students = [
        { id: 1, name: "John Doe", rollNo: "01", avatar: "J", lastMessage: "Fee payment confirmed.", time: "10:30 AM", unread: 0 },
        { id: 2, name: "Jane Smith", rollNo: "02", avatar: "J", lastMessage: "Pending fee details.", time: "Yesterday", unread: 1 },
    ];

    const [conversations, setConversations] = useState<{ [key: number]: { id: number, sender: 'accountant' | 'student', text: string, time: string }[] }>({
        1: [
            { id: 1, sender: 'accountant', text: "Your fee payment has been received.", time: "10:00 AM" },
            { id: 2, sender: 'student', text: "Thank you!", time: "10:15 AM" },
        ],
        2: [
            { id: 1, sender: 'student', text: "Can you provide details of pending fees?", time: "Yesterday" },
        ]
    });

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeStudent = students.find(s => s.id === selectedStudentId);
    const activeMessages = selectedStudentId ? conversations[selectedStudentId] || [] : [];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedStudentId) return;

        const newMsgOption = {
            id: Date.now(),
            sender: 'accountant' as const,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => ({
            ...prev,
            [selectedStudentId]: [...(prev[selectedStudentId] || []), newMsgOption]
        }));
        setNewMessage("");
        setAttachment(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/accounts">
                            <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-700 transition-colors">
                                <ArrowLeft size={20} />
                                <span className="font-medium">Back to Accounts</span>
                            </button>
                        </Link>
                        <div className="h-6 w-px bg-slate-400"></div>
                        <h1 className="text-3xl font-semibold text-slate-800">Message Center</h1>
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This section is strictly for fee-related queries or formal communication.
                    </p>
                </div>

                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Sidebar - Student List */}
                    <div className="w-80 border-r border-gray-200 bg-gray-50">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-3">Students</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-800"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => setSelectedStudentId(student.id)}
                                    className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors hover:bg-white border-b border-transparent ${selectedStudentId === student.id ? 'bg-white border-l-4 border-l-blue-500 shadow-sm' : 'border-gray-50'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {student.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`text-sm font-semibold truncate ${selectedStudentId === student.id ? 'text-blue-500' : 'text-gray-800'}`}>{student.name}</h3>
                                            <span className="text-xs text-gray-400">{student.time}</span>
                                        </div>
                                        <p className={`text-xs truncate ${student.unread > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{student.lastMessage}</p>
                                    </div>
                                    {student.unread > 0 && (
                                        <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                            {student.unread}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        {activeStudent ? (
                            <>
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h2 className="text-lg font-bold text-gray-800">Conversation with {activeStudent.name}</h2>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {activeMessages.map((msg) => (
                                        <div key={msg.id} className="border-b border-gray-200 pb-4">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className={`text-sm font-bold ${msg.sender === 'accountant' ? 'text-blue-600' : 'text-gray-800'}`}>{msg.sender === 'accountant' ? 'You' : activeStudent.name}</h4>
                                                <span className="text-xs text-gray-400">{msg.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">{msg.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message"
                                            className="flex-1 border rounded p-2 text-gray-900 placeholder-gray-500 focus:ring focus:ring-blue-500"
                                        />
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <Paperclip size={20} className="text-gray-400" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                                            />
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || !selectedStudentId}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <p>Select a student to view messages.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}