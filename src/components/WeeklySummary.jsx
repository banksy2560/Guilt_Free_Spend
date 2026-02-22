import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

function getWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7)); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
}

export default function WeeklySummary({ isOpen, onClose }) {
    const { transactions, categories, categoryStats } = useBudget();
    const [slideIndex, setSlideIndex] = useState(0);

    const weekData = useMemo(() => {
        const { start, end } = getWeekRange();
        const weekTxs = transactions.filter(tx => {
            const d = new Date(tx.date);
            return d >= start && d <= end;
        });

        const totalSpent = weekTxs.reduce((s, tx) => s + tx.amount, 0);
        const txCount = weekTxs.length;

        // Per-category breakdown
        const catBreakdown = categories.map(cat => {
            const catTxs = weekTxs.filter(tx => tx.categoryId === cat.id);
            const spent = catTxs.reduce((s, tx) => s + tx.amount, 0);
            const dailyAllowance = categoryStats.find(c => c.id === cat.id)?.dailyAllowance || 0;
            const weeklyBudget = dailyAllowance * 7;
            const saved = Math.max(0, weeklyBudget - spent);
            return { name: cat.name, spent, weeklyBudget, saved };
        }).filter(c => c.weeklyBudget > 0);

        const totalSaved = catBreakdown.reduce((s, c) => s + c.saved, 0);

        // Best category (most saved)
        const bestCat = catBreakdown.reduce((best, c) =>
            c.saved > (best?.saved || 0) ? c : best, null);

        return { totalSpent, txCount, totalSaved, catBreakdown, bestCat };
    }, [transactions, categories, categoryStats]);

    const slides = useMemo(() => {
        const s = [];

        // Slide 1: Overview
        s.push({
            emoji: '📊',
            title: 'Your Week in Review',
            body: `You made ${weekData.txCount} transaction${weekData.txCount !== 1 ? 's' : ''} totalling $${Math.round(weekData.totalSpent)}.`,
            accent: 'from-violet-500 to-indigo-600'
        });

        // Slide 2: Savings
        if (weekData.totalSaved > 0) {
            s.push({
                emoji: '🎉',
                title: 'You Saved Money!',
                body: `You kept $${Math.round(weekData.totalSaved)} in your pocket this week by staying under budget.`,
                accent: 'from-emerald-500 to-teal-600'
            });
        }

        // Slide 3: Best category
        if (weekData.bestCat && weekData.bestCat.saved > 0) {
            s.push({
                emoji: '🏆',
                title: 'Best Category',
                body: `${weekData.bestCat.name}: You saved $${Math.round(weekData.bestCat.saved)} out of your $${Math.round(weekData.bestCat.weeklyBudget)} weekly budget.`,
                accent: 'from-amber-500 to-orange-600'
            });
        }

        // Slide 4: Encouragement
        s.push({
            emoji: '💪',
            title: 'Keep Going',
            body: weekData.totalSaved > 0
                ? 'You\'re building real financial momentum. Every dollar saved is a dollar invested in your future.'
                : 'Every week is a fresh start. Small improvements compound into life-changing results.',
            accent: 'from-pink-500 to-rose-600'
        });

        return s;
    }, [weekData]);

    const totalSlides = slides.length;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="w-full max-w-sm pointer-events-auto">
                            {/* Progress dots */}
                            <div className="flex justify-center gap-2 mb-4">
                                {slides.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                                    />
                                ))}
                            </div>

                            {/* Card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={slideIndex}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className={`bg-gradient-to-br ${slides[slideIndex].accent} rounded-[2rem] p-8 shadow-2xl min-h-[320px] flex flex-col items-center justify-center text-center`}
                                >
                                    <span className="text-6xl mb-6">{slides[slideIndex].emoji}</span>
                                    <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">
                                        {slides[slideIndex].title}
                                    </h3>
                                    <p className="text-white/80 text-lg font-medium leading-relaxed max-w-xs">
                                        {slides[slideIndex].body}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-6 px-2">
                                <button
                                    onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
                                    className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-opacity ${slideIndex === 0 ? 'opacity-30 cursor-default' : 'hover:bg-white/20'}`}
                                    disabled={slideIndex === 0}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <button
                                    onClick={onClose}
                                    className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                                >
                                    {slideIndex === totalSlides - 1 ? 'Done' : 'Skip'}
                                </button>

                                <button
                                    onClick={() => {
                                        if (slideIndex === totalSlides - 1) onClose();
                                        else setSlideIndex(slideIndex + 1);
                                    }}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-opacity"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
