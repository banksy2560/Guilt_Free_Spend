import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, AlertTriangle, CalendarDays } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { getMerchantEmoji } from '../utils/merchant-icons';
import { detectSubscriptions } from '../utils/subscriptions';

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const fmtAnnual = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

// Dummy replace just to continue, file is fine.
export default function SubscriptionTracker({ isOpen, onClose }) {
    const { transactions, categories } = useBudget();

    const subscriptions = useMemo(() => {
        return detectSubscriptions(transactions);
    }, [transactions]);

    const totalAnnualDrain = subscriptions.reduce((sum, sub) => sum + sub.annualCost, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md z-40 cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 bottom-0 left-0 w-[400px] max-w-[90vw] bg-gray-50 dark:bg-[#121212] shadow-2xl z-50 overflow-hidden flex flex-col border-r border-gray-200 dark:border-white/10"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="text-rose-500" size={20} />
                                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-display">Subscriptions</h3>
                            </div>
                            <button
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                onClick={onClose}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 relative font-sans">
                            {subscriptions.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                        <RefreshCw size={24} className="opacity-50" />
                                    </div>
                                    <p className="text-[15px] font-medium text-gray-900 dark:text-white mb-1">No recurring charges found</p>
                                    <p className="text-sm">We analyze your history to find repeating transactions automatically.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">

                                    {/* Annual Summary Card */}
                                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[1.5rem] p-6 text-white shadow-lg shadow-rose-500/20 relative overflow-hidden">
                                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 blur-2xl rounded-full"></div>
                                        <div className="flex items-center gap-2 mb-2 opacity-90">
                                            <AlertTriangle size={16} />
                                            <h4 className="font-semibold text-sm tracking-wide uppercase">Annual Drain</h4>
                                        </div>
                                        <div className="text-5xl font-black font-display tracking-tighter mb-1">
                                            {fmtAnnual.format(totalAnnualDrain)}
                                        </div>
                                        <p className="text-rose-100 text-sm font-medium">Siphoned from your wealth every year.</p>
                                    </div>

                                    {/* List */}
                                    <div className="flex flex-col gap-3 pb-8">
                                        <h4 className="px-2 text-sm font-bold text-gray-500 uppercase tracking-widest">Active Subscriptions</h4>
                                        {subscriptions.map((sub, i) => (
                                            <div
                                                key={i}
                                                className="bg-white dark:bg-[#1C1C1E] rounded-[1rem] p-4 flex flex-col gap-3 shadow-sm border border-gray-100 dark:border-white/5"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-3 items-center">
                                                        <div className="text-2xl w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                                            {getMerchantEmoji(sub.merchant) || '💳'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-[16px] text-gray-900 dark:text-white">{sub.merchant}</span>
                                                            <span className="text-[13px] text-gray-500 font-medium flex items-center gap-1">
                                                                <CalendarDays size={12} /> {sub.frequency}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block font-bold text-[16px] text-gray-900 dark:text-white">{fmt.format(sub.amount)}</span>
                                                        <span className="block text-[12px] text-rose-500 font-bold mt-0.5">{fmtAnnual.format(sub.annualCost)} /yr</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-white/5">
                                                    <button className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                                        Ignore
                                                    </button>
                                                    <a
                                                        href={`https://www.google.com/search?q=how+to+cancel+${encodeURIComponent(sub.merchant)}+subscription`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors text-center"
                                                    >
                                                        Cancel It
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
