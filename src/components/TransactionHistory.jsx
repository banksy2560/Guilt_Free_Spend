import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBudget } from '../context/BudgetContext';
import { getMerchantEmoji } from '../utils/merchant-icons';

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TransactionHistory({ isOpen, onClose }) {
    const {
        transactions, pendingTransactions, categories, deleteTransaction,
        confirmPendingTransaction, cancelPendingTransaction
    } = useBudget();

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
                            {enriched.length === 0 && (!pendingTransactions || pendingTransactions.length === 0) ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                    <p className="text-[15px] font-medium">No transactions yet.</p>
                                    <p className="text-sm mt-1">Transactions you add will appear here.</p>
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-3 pb-8">
                                    <AnimatePresence mode="popLayout">
                                        {/* --- PENDING / COOLDOWN VAULT --- */}
                                        {pendingTransactions?.map((tx) => {
                                            const cat = categories.find(c => c.id === tx.categoryId);
                                            // Handle potential invalid date
                                            let timeRemaining = 'Unknown';
                                            let isUnlocked = false;
                                            try {
                                                const unlockDate = new Date(tx.unlocksAt);
                                                if (!isNaN(unlockDate.getTime())) {
                                                    timeRemaining = formatDistanceToNow(unlockDate);
                                                    isUnlocked = new Date() > unlockDate;
                                                }
                                            } catch (e) {
                                                console.error('Invalid date format:', tx.unlocksAt);
                                            }

                                            return (
                                                <motion.li
                                                    key={tx.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                                    layout
                                                    className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-[1rem] p-4 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.1)] dark:shadow-none border border-amber-200/60 dark:border-amber-700/30 overflow-hidden relative"
                                                >
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[4rem] pointer-events-none"></div>

                                                    <div className="flex justify-between items-start relative z-10 w-full">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-200 shadow-sm font-bold text-lg">
                                                                ⏳
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h3 className="font-semibold text-gray-900 dark:text-white text-[16px] tracking-tight">
                                                                    {tx.notes || 'Unnamed Purchase'}
                                                                </h3>
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <Clock size={12} className="text-amber-600 dark:text-amber-400" />
                                                                    <p className="text-[13px] text-amber-700 dark:text-amber-400/90 font-medium">
                                                                        {isUnlocked ? "Cooldown complete!" : `Unlocks in ${timeRemaining}`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end">
                                                            <p className="font-bold text-gray-900 dark:text-white text-[17px] tracking-tight">
                                                                {fmt.format(tx.amount)}
                                                            </p>
                                                            <p className="text-[12px] text-amber-600/70 dark:text-amber-500/60 font-medium mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {cat?.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 relative z-10 w-full mt-1">
                                                        <button
                                                            onClick={() => cancelPendingTransaction(tx.id)}
                                                            className="flex-1 py-2.5 rounded-xl bg-white dark:bg-black/20 text-red-600 dark:text-red-400 text-[14px] font-semibold border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-1.5 transition-colors group"
                                                        >
                                                            <XCircle size={16} className="group-hover:scale-110 transition-transform" /> Cancel
                                                        </button>
                                                        <button
                                                            disabled={!isUnlocked}
                                                            onClick={() => confirmPendingTransaction(tx)}
                                                            className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-all ${isUnlocked ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md' : 'bg-amber-500/40 text-white/90 cursor-not-allowed dark:bg-amber-500/20 dark:text-white/50 border border-amber-500/10'}`}
                                                        >
                                                            <CheckCircle2 size={16} className={isUnlocked ? "animate-pulse" : ""} /> {isUnlocked ? 'Buy Now' : 'Locked'}
                                                        </button>
                                                    </div>
                                                </motion.li>
                                            );
                                        })}

                                        {/* --- STANDARD TRANSACTIONS --- */}
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
