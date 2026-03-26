"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Paperclip } from "lucide-react";

export default function MessagesPage() {
    const [messageRecipient, setMessageRecipient] = useState("Class Teacher");
    const [attachment, setAttachment] = useState<File | null>(null);

    // Updated recipient list
    const messageRecipients = ["Class Teacher", "Principal", "Accountant", "Admin"];

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSendMessage = () => {
        console.log("Sending message to:", messageRecipient);
        console.log("Attachment:", attachment);
        alert(`Message sent to ${messageRecipient}${attachment ? ` with attachment: ${attachment.name}` : " without attachment"}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/student/classroom">
                            <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
                                <ArrowLeft size={20} />
                                <span className="font-medium">Back</span>
                            </button>
                        </Link>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <h1 className="text-3xl font-bold text-slate-800">Compose Message</h1>
                    </div>
                </div>

                {/* Disclaimer Section */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This section is strictly for queries, issues, or formal communication. Please refrain from using it for casual or continuous chat.
                    </p>
                </div>

                {/* Message Form */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Recipient</label>
                        <select
                            value={messageRecipient}
                            onChange={(e) => setMessageRecipient(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-4 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                        >
                            {messageRecipients.map((recipient, index) => (
                                <option key={index} value={recipient}>{recipient}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                        <input
                            type="text"
                            placeholder="Enter message subject"
                            className="w-full bg-white border border-slate-300 rounded-md px-4 py-2 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea
                            rows={10}
                            placeholder="Type your message here..."
                            className="w-full bg-white border border-slate-300 rounded-md px-4 py-2 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Attachment</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                onChange={handleAttachmentChange}
                                className="bg-white border border-slate-300 rounded-md px-4 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                            />
                            {attachment && (
                                <span className="text-sm text-slate-600">{attachment.name}</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSendMessage}
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}
