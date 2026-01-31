"use client";

import { promoteStudentsAction } from "@/actions/promotion-actions";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function PromotionButton({ yearId, disabled }: { yearId: string, disabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handlePromote = async () => {
        if (!confirm("Are you sure you want to promote ALL students? This cannot be undone.")) return;

        setLoading(true);
        setMessage("");

        const res = await promoteStudentsAction(yearId);

        if (res.success && 'promotedCount' in res) {
            setMessage(`Success! Promoted: ${res.promotedCount}, Graduated: ${res.graduatedCount}`);
        } else {
            const errorMsg = 'error' in res ? res.error : "Unknown error";
            setMessage("Error: " + errorMsg);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-end">
            <button
                onClick={handlePromote}
                disabled={disabled || loading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all
            ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}
        `}
            >
                <span>{loading ? "Promoting..." : "Promote Students"}</span>
                {!loading && <ArrowRight size={20} />}
            </button>
            {message && <p className="mt-2 text-sm font-medium text-gray-700">{message}</p>}
        </div>
    );
}
