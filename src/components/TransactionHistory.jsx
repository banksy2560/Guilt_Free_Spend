import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { getMerchantEmoji } from '../utils/merchant-icons';

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TransactionHistory({ isOpen, onClose }) {
    const { transactions, categories, deleteTransaction } = useBudget();

    const enriched = transactions.map(tx => ({
        ...tx,
        categoryName: categories.find(c => c.id === tx.categoryId)?.name || 'Unknown'
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-40 cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 bottom-0 right-0 w-[400px] max-w-[90vw] bg-gray-50 dark:bg-[#1C1C1E] shadow-2xl z-50 overflow-hidden flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md sticky top-0 z-10">
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-display">History</h3>
                            <button
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                onClick={onClose}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 px-6 relative">
                            {enriched.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                    <p className="text-[15px] font-medium">No transactions yet.</p>
                                    <p className="text-sm mt-1">Transactions you add will appear here.</p>
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-3 pb-8">
                                    <AnimatePresence mode="popLayout">
                                        {enriched.map(tx => (
                                            <motion.li
                                                key={tx.id}
                                                className="bg-white dark:bg-[#2C2C2E] rounded-[1rem] p-4 flex justify-between items-center shadow-sm border border-gray-100 dark:border-white/5 group"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                                layout
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-[17px] text-gray-900 dark:text-white tracking-tight">{tx.categoryName}</span>
                                                    {tx.notes && (
                                                        <span className="text-[15px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                            {getMerchantEmoji(tx.notes) && <span className="text-base">{getMerchantEmoji(tx.notes)}</span>}
                                                            {tx.notes}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{formatDate(tx.date)}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="font-bold text-[17px] text-gray-900 dark:text-white tracking-tight">{fmt.format(tx.amount)}</span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1.5 rounded-full bg-red-50 dark:bg-red-500/10 opacity-0 group-hover:opacity-100"
                                                        onClick={() => deleteTransaction(tx.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
