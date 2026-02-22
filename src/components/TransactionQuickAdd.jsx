import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { getMerchantEmoji } from '../utils/merchant-icons';

export default function TransactionQuickAdd() {
    const { categories, addTransaction } = useBudget();
    const [isOpen, setIsOpen] = useState(false);

    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    const [notes, setNotes] = useState('');
    const liveEmoji = useMemo(() => getMerchantEmoji(notes), [notes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || !categoryId) return;

        addTransaction(categoryId, parseFloat(amount), notes);

        setAmount('');
        setNotes('');
        setIsOpen(false);
    };

    return (
        <>
            {/* FAB */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        id="fab-trigger"
                        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-2xl shadow-violet-500/30 flex items-center justify-center z-40 border border-white/10"
                        onClick={() => setIsOpen(true)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={28} strokeWidth={2.5} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Bottom Sheet Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet Container */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white dark:bg-[#1C1C1E] rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Drag Handle Indicator */}
                            <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            </div>

                            <div className="px-6 pt-2 pb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Add Spending</h3>
                                    <button
                                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {/* Large iOS-style Amount Input */}
                                    <div className="flex flex-col items-center justify-center py-8 mb-4">
                                        <div className="flex items-center text-gray-900 dark:text-white font-display">
                                            <span className="text-4xl font-semibold mr-1 opacity-50">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0"
                                                className="text-6xl font-black bg-transparent border-none outline-none w-full max-w-[220px] text-center p-0 m-0 placeholder-gray-300 dark:placeholder-gray-700"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                autoFocus
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Grouped iOS-style Settings Inputs */}
                                    <div className="bg-gray-50 dark:bg-white/[0.04] rounded-[1.5rem] p-2 flex flex-col gap-1 border border-gray-100 dark:border-white/5">
                                        <div className="relative flex items-center bg-white dark:bg-white/5 rounded-2xl px-4 py-3.5 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5">
                                            <label className="text-[15px] font-medium text-gray-500 dark:text-gray-400 w-24">Category</label>
                                            <div className="relative flex-1">
                                                <select
                                                    className="w-full appearance-none bg-transparent text-gray-900 dark:text-white font-semibold text-[15px] outline-none z-10 relative cursor-pointer"
                                                    value={categoryId}
                                                    onChange={(e) => setCategoryId(e.target.value)}
                                                    required
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center bg-white dark:bg-white/5 rounded-2xl px-4 py-3.5 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5">
                                            <label className="text-[15px] font-medium text-gray-500 dark:text-gray-400 w-24">Note</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Coffee"
                                                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white font-medium text-[15px] placeholder-gray-300 dark:placeholder-gray-600"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                            {liveEmoji && (
                                                <motion.span
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="text-2xl ml-2"
                                                >
                                                    {liveEmoji}
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Primary CTA */}
                                    <motion.button
                                        type="submit"
                                        className="w-full mt-2 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-[17px] tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={!amount}
                                    >
                                        Save Transaction
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
