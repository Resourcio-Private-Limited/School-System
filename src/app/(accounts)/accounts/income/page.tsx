"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, X, Save, IndianRupee, Calendar, Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

interface Income {
    id: number;
    date: string;
    source: string;
    amount: number;
    category: string;
    addedBy: string;
    paymentMode: "Cash" | "Online" | "Card" | "Cheque";
    chequeNumber?: string;
}

const paymentModes = ["Cash", "Online", "Card", "Cheque"] as const;
type PaymentMode = typeof paymentModes[number];

export default function IncomePage() {
    const [showModal, setShowModal] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"all" | "day" | "month">("all");
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        source: "",
        amount: 0,
        category: "Other",
        paymentMode: "Cash" as PaymentMode,
        chequeNumber: ""
    });

    const [incomes, setIncomes] = useState<Income[]>([
        { id: 1, date: "2024-01-15", source: "Annual Day Event", amount: 50000, category: "Events", addedBy: "Accountant User", paymentMode: "Online" },
        { id: 2, date: "2024-01-20", source: "Donation from Alumni", amount: 100000, category: "Donations", addedBy: "Accountant User", paymentMode: "Cheque", chequeNumber: "CHQ123456" },
        { id: 3, date: "2024-01-25", source: "Sports Day Sponsorship", amount: 75000, category: "Events", addedBy: "Accountant User", paymentMode: "Cash" },
        { id: 4, date: "2024-02-01", source: "Book Sale", amount: 15000, category: "Other", addedBy: "Accountant User", paymentMode: "Card" },
    ]);

    const handleOpenModal = (income?: Income) => {
        if (income) {
            setEditingIncome(income);
            setFormData({
                date: income.date,
                source: income.source,
                amount: income.amount,
                category: income.category,
                paymentMode: income.paymentMode,
                chequeNumber: income.chequeNumber || ""
            });
        } else {
            setEditingIncome(null);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                source: "",
                amount: 0,
                category: "Other",
                paymentMode: "Cash",
                chequeNumber: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingIncome(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            source: "",
            amount: 0,
            category: "Other",
            paymentMode: "Cash",
            chequeNumber: ""
        });
    };

    const handleSave = () => {
        if (editingIncome) {
            setIncomes(incomes.map(inc =>
                inc.id === editingIncome.id
                    ? { ...inc, ...formData }
                    : inc
            ));
        } else {
            const newIncome: Income = {
                id: Date.now(),
                ...formData,
                addedBy: "Accountant User"
            };
            setIncomes([newIncome, ...incomes]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this income entry?")) {
            setIncomes(incomes.filter(inc => inc.id !== id));
        }
    };

    const handleExport = (format: "csv" | "xlsx") => {
        const data = filteredIncomes.map(({ id, ...rest }) => rest);
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

        if (format === "csv") {
            XLSX.writeFile(workbook, "income_data.csv", { bookType: "csv" });
        } else {
            XLSX.writeFile(workbook, "income_data.xlsx", { bookType: "xlsx" });
        }
    };

    const filteredIncomes = incomes.filter(income => 
        income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "day") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === "month") {
            const aMonth = new Date(a.date).toISOString().slice(0, 7);
            const bMonth = new Date(b.date).toISOString().slice(0, 7);
            return bMonth.localeCompare(aMonth);
        }
        return 0;
    });

    const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Income Management</h1>
                    <p className="text-gray-500 mt-1">Track income sources other than student fees</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleExport("csv")}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        <Download size={20} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => handleExport("xlsx")}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        <Download size={20} />
                        <span>Export XLSX</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        <PlusCircle size={20} />
                        <span>Add Income</span>
                    </button>
                </div>
            </div>

            {/* Search and Sort */}
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by source or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "all" | "day" | "month")}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                >
                    <option value="all">All</option>
                    <option value="day">Sort by Day</option>
                    <option value="month">Sort by Month</option>
                </select>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-amber-100 text-sm font-medium">Total Income (Other than Fees)</p>
                        <h2 className="text-4xl font-bold mt-2">₹{totalIncome.toLocaleString()}</h2>
                        <p className="text-amber-100 text-sm mt-2">{filteredIncomes.length} entries</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg">
                        <IndianRupee size={48} />
                    </div>
                </div>
            </div>

            {/* Income List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-amber-500">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Source</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Payment Mode</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Added By</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredIncomes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No income entries yet. Click "Add Income" to create one.
                                    </td>
                                </tr>
                            ) : (
                                filteredIncomes.map((income) => (
                                    <tr key={income.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(income.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-900">{income.source}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {income.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-green-600">₹{income.amount.toLocaleString()}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {income.chequeNumber && income.paymentMode === "Cheque" ? `${income.paymentMode} (${income.chequeNumber})` : income.paymentMode}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{income.addedBy}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(income)}
                                                    className="p-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(income.id)}
                                                    className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-amber-600 text-white p-6 flex items-center justify-between rounded-t-xl sticky top-0">
                            <h2 className="text-2xl font-bold">
                                {editingIncome ? "Edit Income" : "Add Income"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-amber-700 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Source */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Source <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                                    placeholder="e.g., Annual Day Event"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                                >
                                    <option value="Donations">Donations</option>
                                    <option value="Events">Events</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IndianRupee size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>

                            {/* Payment Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Payment Mode <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.paymentMode}
                                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as PaymentMode })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online</option>
                                    <option value="Card">Card</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            {/* Cheque Number */}
                            {formData.paymentMode === "Cheque" && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cheque Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.chequeNumber}
                                        onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none text-gray-800"
                                        placeholder="Enter cheque number"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end space-x-3 rounded-b-xl sticky bottom-0">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.source || formData.amount <= 0 || (formData.paymentMode === "Cheque" && !formData.chequeNumber)}
                                className="flex items-center space-x-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}