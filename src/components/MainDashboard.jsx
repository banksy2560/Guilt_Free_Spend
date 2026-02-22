import React, { useMemo, useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { WalletCards, PiggyBank, Target, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainDashboard() {
    const { totalRemainingToday, totalDailyAllowance, monthSavedSoFar } = useBudget();

    // Goal State
    const [goalName, setGoalName] = useState(() => localStorage.getItem('gfs-goal-name') || 'Japan Trip');
    const [goalAmount, setGoalAmount] = useState(() => Number(localStorage.getItem('gfs-goal-amount')) || 1500);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempGoalName, setTempGoalName] = useState(goalName);
    const [tempGoalAmount, setTempGoalAmount] = useState(goalAmount);

    useEffect(() => {
        localStorage.setItem('gfs-goal-name', goalName);
        localStorage.setItem('gfs-goal-amount', goalAmount.toString());
    }, [goalName, goalAmount]);

    const saveGoal = () => {
        setGoalName(tempGoalName || 'My Goal');
        setGoalAmount(Number(tempGoalAmount) || 100);
        setIsEditingGoal(false);
    };

    const goalProgress = Math.min(100, (monthSavedSoFar / goalAmount) * 100);

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

                {/* Snowball Vault & Visual Goal */}
                <AnimatePresence mode="wait">
                    {monthSavedSoFar > 0 && !isEditingGoal && (
                        <motion.button
                            key="goal-display"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => {
                                setTempGoalName(goalName);
                                setTempGoalAmount(goalAmount);
                                setIsEditingGoal(true);
                            }}
                            className="mt-6 flex flex-col items-center gap-2 px-6 py-4 rounded-[2rem] bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 hover:bg-white/80 dark:hover:bg-white/5 transition-all group w-full max-w-[320px] relative overflow-hidden"
                        >
                            {/* Progress Ring Background */}
                            <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10" style={{ width: `${goalProgress}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>

                            <div className="flex w-full justify-between items-center relative z-10">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                    <Target size={18} />
                                    <span className="font-bold text-[15px]">{goalName}</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit2 size={12} /> Edit
                                </span>
                            </div>

                            <div className="w-full relative z-10">
                                <div className="flex justify-between items-baseline mb-1.5">
                                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">${Math.round(monthSavedSoFar)}</span>
                                    <span className="text-sm text-gray-400 font-medium">of ${goalAmount}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goalProgress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-500 font-medium mt-2 text-left">
                                    {goalProgress >= 100 ? "Goal met! 🎉" : "Saved from underspending this month"}
                                </p>
                            </div>
                        </motion.button>
                    )}

                    {isEditingGoal && (
                        <motion.div
                            key="goal-edit"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-6 flex flex-col gap-3 px-6 py-5 rounded-[2rem] bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 shadow-xl w-full max-w-[320px] relative z-20"
                        >
                            <div className="flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                                <Target size={16} className="text-emerald-500" />
                                <h4 className="font-bold text-[15px]">Set Visual Goal</h4>
                            </div>

                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={tempGoalName}
                                    onChange={(e) => setTempGoalName(e.target.value)}
                                    placeholder="What are you saving for?"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                                />
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        value={tempGoalAmount}
                                        onChange={(e) => setTempGoalAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={saveGoal}
                                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-2.5 rounded-xl transition-colors flex justify-center items-center gap-1.5"
                            >
                                <Check size={16} /> Save Goal
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background decor — temperature-reactive */}
            <div
                className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] pointer-events-none rounded-full transition-all duration-1000"
                style={{ background: `radial-gradient(circle, ${temperatureGlow} 0%, transparent 60%)` }}
            ></div>
        </div>
    );
}
