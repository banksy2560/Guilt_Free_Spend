import React, { useState, useEffect, useCallback } from 'react';
import { BudgetProvider } from '../context/BudgetContext';
import { useToast } from '../context/ToastContext';
import { useBudget } from '../context/BudgetContext';
import MainDashboard from '../components/MainDashboard';
import CategoryList from '../components/CategoryList';
import TransactionQuickAdd from '../components/TransactionQuickAdd';
import TransactionHistory from '../components/TransactionHistory';
import AddCategoryModal from '../components/AddCategoryModal';
import SpendingHistoryChart from '../components/SpendingHistoryChart';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import WeeklySummary from '../components/WeeklySummary';
import SubscriptionTracker from '../components/SubscriptionTracker';
import InstallPrompt from '../components/InstallPrompt';
import { History, Moon, Sun, PlusCircle, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function DashboardShell() {
    const { isLoading, categories } = useBudget();
    const [historyOpen, setHistoryOpen] = useState(false);
    const [addCatOpen, setAddCatOpen] = useState(false);
    const [weeklyOpen, setWeeklyOpen] = useState(false);
    const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('gfs-theme', 'dark');
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
            if (e.key === 'n' || e.key === 'N') document.getElementById('fab-trigger')?.click();
            if (e.key === 'h' || e.key === 'H') setHistoryOpen(prev => !prev);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const hasCategories = categories.length > 0;

    return (
        <div className="min-h-screen bg-transparent overflow-x-hidden pointer-events-none">
            <div className="w-full max-w-[480px] md:max-w-2xl lg:max-w-3xl mx-auto px-4 pb-28 min-h-screen relative pointer-events-auto transition-all duration-500" style={{
                backgroundColor: 'rgba(10, 10, 18, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255,255,255,0.03)',
                borderRight: '1px solid rgba(255,255,255,0.03)',
            }}>
                {/* Header */}
                <header className="pt-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.8)',
                            }}
                            title="Back to landing"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className="text-xl font-display font-bold text-white tracking-tight drop-shadow-md">
                            Guilt-Free Spending
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="header-btn" onClick={() => setSubscriptionsOpen(true)} title="View Subscriptions">
                            <RefreshCw size={18} className="text-rose-400" />
                        </button>
                        <button className="header-btn" onClick={() => setWeeklyOpen(true)} title="Weekly Summary">
                            <Sparkles size={18} />
                        </button>
                        <button className="header-btn" onClick={() => setAddCatOpen(true)} title="Add category">
                            <PlusCircle size={18} />
                        </button>
                        <button className="header-btn" onClick={() => setHistoryOpen(true)} title="History (H)">
                            <History size={18} />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex flex-col gap-6">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : !hasCategories ? (
                        <EmptyState onAddCategory={() => setAddCatOpen(true)} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col gap-6"
                        >
                            <MainDashboard />
                            <SpendingHistoryChart />
                            <CategoryList onAddCategory={() => setAddCatOpen(true)} />
                        </motion.div>
                    )}
                </main>

                {hasCategories && <TransactionQuickAdd />}
                <TransactionHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
                <SubscriptionTracker isOpen={subscriptionsOpen} onClose={() => setSubscriptionsOpen(false)} />
                <AddCategoryModal isOpen={addCatOpen} onClose={() => setAddCatOpen(false)} />
                <WeeklySummary isOpen={weeklyOpen} onClose={() => setWeeklyOpen(false)} />
                <InstallPrompt />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { addToast } = useToast();
    return (
        <BudgetProvider addToast={addToast}>
            <DashboardShell />
        </BudgetProvider>
    );
}
