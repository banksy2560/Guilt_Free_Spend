import React, { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { WalletCards, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MainDashboard() {
    const { totalRemainingToday, totalDailyAllowance, monthSavedSoFar } = useBudget();

    // Format currency
    const formattedAllowance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalRemainingToday);

    // Contextual Friction: temperature-shift based on spending ratio
    const spentRatio = totalDailyAllowance > 0
        ? Math.max(0, 1 - (totalRemainingToday / totalDailyAllowance))
        : 0;

    const temperatureGlow = useMemo(() => {
        if (spentRatio >= 1) return 'rgba(239,68,68,0.18)';     // Red — over budget
        if (spentRatio >= 0.8) return 'rgba(245,158,11,0.15)';   // Amber — approaching limit
        if (spentRatio >= 0.6) return 'rgba(168,85,247,0.12)';   // Warm purple — halfway
        return 'rgba(124,58,237,0.15)';                            // Cool purple — plenty left
    }, [spentRatio]);

    const temperatureText = useMemo(() => {
        if (spentRatio >= 1) return 'text-red-400';
        if (spentRatio >= 0.8) return 'text-amber-400';
        return 'text-violet-400';
    }, [spentRatio]);

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-white/50 dark:bg-white/[0.03] backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-8 pt-10 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all duration-700">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent pointer-events-none rounded-[2rem]"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 mb-6 backdrop-blur-md border border-gray-200 dark:border-white/5">
                    <WalletCards size={16} className={`text-violet-600 dark:${temperatureText}`} />
                    <span className="text-xs font-semibold tracking-widest text-gray-700 dark:text-gray-300 uppercase">Available Today</span>
                </div>

                <h1 className="text-7xl md:text-8xl font-display font-black tracking-tighter text-gray-900 dark:text-white mb-2 drop-shadow-sm dark:drop-shadow-lg transition-colors duration-700">
                    {formattedAllowance}
                </h1>

                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Without blowing your month.</p>

                {/* Snowball Vault */}
                {monthSavedSoFar > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-5 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                    >
                        <PiggyBank size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            ${Math.round(monthSavedSoFar)} saved this month
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Background decor — temperature-reactive */}
            <div
                className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] pointer-events-none rounded-full transition-all duration-1000"
                style={{ background: `radial-gradient(circle, ${temperatureGlow} 0%, transparent 60%)` }}
            ></div>
        </div>
    );
}
