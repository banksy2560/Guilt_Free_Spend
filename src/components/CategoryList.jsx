import React from 'react';
import { useBudget } from '../context/BudgetContext';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

const MOMENTUM_CONFIG = {
    'ahead': { label: 'Ahead', class: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400' },
    'on-track': { label: 'On track', class: 'text-violet-700 bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400' },
    'overpacing': { label: 'Overpacing', class: 'text-amber-700 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400' },
};

export default function CategoryList({ onAddCategory }) {
    const { categoryStats } = useBudget();

    return (
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-baseline px-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Your Allowances</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryStats.map((cat, i) => {
                    // Lazy icon lookup
                    const iconKey = cat.icon
                        ? cat.icon.charAt(0).toUpperCase() + cat.icon.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
                        : 'Circle';
                    const Icon = Icons[iconKey] || Icons.Circle;

                    const spendRatio = cat.dailyAllowance > 0 ? (cat.spentToday / cat.dailyAllowance) : 0;
                    const cappedRatio = Math.min(spendRatio, 1);

                    let statusClass = 'bg-emerald-500';
                    let iconBg = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
                    if (spendRatio >= 0.8 && spendRatio < 1) {
                        statusClass = 'bg-amber-500';
                        iconBg = 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
                    }
                    if (spendRatio >= 1) {
                        statusClass = 'bg-red-500';
                        iconBg = 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
                    }

                    const mom = MOMENTUM_CONFIG[cat.momentum] || MOMENTUM_CONFIG['on-track'];

                    return (
                        <motion.button
                            key={cat.id}
                            className="text-left relative overflow-hidden rounded-[1.5rem] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200 dark:border-white/[0.05] p-5 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} shadow-inner`}>
                                        <Icon size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">{cat.name}</h3>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">${cat.limit} / mo</p>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${mom.class}`}>
                                    {mom.label}
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    ${Math.round(cat.remainingToday)}
                                </span>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">left today</span>
                            </div>

                            <div className="h-2.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    className={`h-full rounded-full ${statusClass}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cappedRatio * 100}%` }}
                                    transition={{ duration: 1, ease: 'circOut' }}
                                />
                            </div>

                            {/* Time to Recover message */}
                            {cat.recoveryDays > 0 && (
                                <motion.p
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-2"
                                >
                                    Spend $0 for {cat.recoveryDays} day{cat.recoveryDays > 1 ? 's' : ''} to recover.
                                </motion.p>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
