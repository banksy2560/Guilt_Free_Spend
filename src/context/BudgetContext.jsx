import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getDaysRemainingInMonth, isCurrentMonth, calculateDailyAllowance } from '../utils/date-math';
import { supabase } from '../lib/supabase';

const BudgetContext = createContext();

export function BudgetProvider({ children, addToast }) {
    const [data, setData] = useState({ categories: [], transactions: [] });
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial data from Supabase
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const [categoriesRes, transactionsRes] = await Promise.all([
                    supabase.from('categories').select('*').order('created_at', { ascending: true }),
                    supabase.from('transactions').select('*').order('date', { ascending: false })
                ]);

                if (categoriesRes.error) throw categoriesRes.error;
                if (transactionsRes.error) throw transactionsRes.error;

                setData({
                    categories: categoriesRes.data.map(c => ({ ...c, limit: parseFloat(c.limit) })),
                    transactions: transactionsRes.data.map(t => ({
                        ...t, categoryId: t.category_id, amount: parseFloat(t.amount)
                    }))
                });

                // Load pending transactions from local storage
                const savedPending = localStorage.getItem('gfs-pending');
                if (savedPending) setPendingTransactions(JSON.parse(savedPending));

            } catch (err) {
                console.error('Error fetching data:', err.message);
                setError(err.message);
                addToast?.('Failed to load data from cloud', 'error');
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // Save pending transactions to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('gfs-pending', JSON.stringify(pendingTransactions));
    }, [pendingTransactions]);

    const addTransaction = useCallback(async (categoryId, amount, notes = '') => {
        try {
            const { data: newTx, error } = await supabase
                .from('transactions')
                .insert([{ category_id: categoryId, amount, notes }])
                .select().single();
            if (error) throw error;
            const formatted = { ...newTx, categoryId: newTx.category_id, amount: parseFloat(newTx.amount) };
            setData(prev => ({ ...prev, transactions: [formatted, ...prev.transactions] }));
            addToast?.('Transaction saved!', 'success');
        } catch (err) {
            console.error('Error adding transaction:', err.message);
            addToast?.('Failed to save transaction', 'error');
        }
    }, [addToast]);

    const addPendingTransaction = useCallback((categoryId, amount, notes = '') => {
        const newPending = {
            id: 'pending_' + Date.now(),
            categoryId,
            amount,
            notes,
            date: new Date().toISOString(),
            unlocksAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        };
        setPendingTransactions(prev => [newPending, ...prev]);
        addToast?.('Added to 24h Cooldown Vault', 'success');
    }, [addToast]);

    const confirmPendingTransaction = useCallback(async (pendingTx) => {
        // Remove from pending
        setPendingTransactions(prev => prev.filter(tx => tx.id !== pendingTx.id));
        // Add to real transactions
        await addTransaction(pendingTx.categoryId, pendingTx.amount, pendingTx.notes);
    }, [addTransaction]);

    const cancelPendingTransaction = useCallback((id) => {
        setPendingTransactions(prev => prev.filter(tx => tx.id !== id));
        addToast?.('Impulse buy avoided! Great job.', 'success');
    }, [addToast]);

    const addCategory = useCallback(async (name, limit, icon = 'circle') => {
        try {
            const { data: newCat, error } = await supabase
                .from('categories').insert([{ name, limit, icon }]).select().single();
            if (error) throw error;
            setData(prev => ({
                ...prev,
                categories: [...prev.categories, { ...newCat, limit: parseFloat(newCat.limit) }]
            }));
        } catch (err) {
            console.error('Error adding category:', err.message);
            addToast?.('Failed to add category', 'error');
        }
    }, [addToast]);

    const deleteTransaction = useCallback(async (id) => {
        try {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) throw error;
            setData(prev => ({ ...prev, transactions: prev.transactions.filter(tx => tx.id !== id) }));
            addToast?.('Transaction deleted', 'success');
        } catch (err) {
            console.error('Error deleting transaction:', err.message);
            addToast?.('Failed to delete transaction', 'error');
        }
    }, [addToast]);

    // Derived state — compute today ONCE to avoid new Date() per category per render
    const categoryStats = useMemo(() => {
        const today = new Date();
        const todayDate = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const currentMonthTxs = data.transactions.filter(tx => isCurrentMonth(tx.date));
        const daysRemaining = getDaysRemainingInMonth();
        const daysElapsed = todayDate;

        return data.categories.map(cat => {
            const catTxs = currentMonthTxs.filter(tx => tx.categoryId === cat.id);
            const spentThisMonth = catTxs.reduce((s, tx) => s + tx.amount, 0);
            const remainingBudget = cat.limit - spentThisMonth;
            const dailyAllowance = calculateDailyAllowance(remainingBudget, daysRemaining);
            const spentToday = catTxs
                .filter(tx => new Date(tx.date).getDate() === todayDate)
                .reduce((s, tx) => s + tx.amount, 0);
            const remainingToday = Math.max(0, dailyAllowance - spentToday);

            // Momentum: compare actual spend to ideal pace
            const idealSpentByNow = (cat.limit / daysInMonth) * daysElapsed;
            let momentum = 'on-track';
            if (spentThisMonth > idealSpentByNow * 1.1) momentum = 'overpacing';
            else if (spentThisMonth < idealSpentByNow * 0.9) momentum = 'ahead';

            // Recovery: if overspent today, how many $0-spend days to recover?
            let recoveryDays = 0;
            if (spentToday > dailyAllowance && dailyAllowance > 0) {
                const overspend = spentToday - dailyAllowance;
                recoveryDays = Math.ceil(overspend / dailyAllowance);
            }

            return {
                ...cat,
                spentThisMonth,
                remainingBudget,
                dailyAllowance,
                spentToday,
                remainingToday,
                daysRemaining,
                momentum,
                recoveryDays
            };
        });
    }, [data.categories, data.transactions]);

    const totalDailyAllowance = categoryStats.reduce((s, c) => s + c.dailyAllowance, 0);
    const totalRemainingToday = categoryStats.reduce((s, c) => s + c.remainingToday, 0);

    // Snowball Rollover: compute total money saved this month vs ideal pace
    const monthSavedSoFar = useMemo(() => {
        const today = new Date();
        const daysElapsed = today.getDate();
        const totalBudget = data.categories.reduce((s, c) => s + c.limit, 0);
        const idealSpentByNow = (totalBudget / new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) * daysElapsed;
        const totalSpent = categoryStats.reduce((s, c) => s + c.spentThisMonth, 0);
        return Math.max(0, idealSpentByNow - totalSpent);
    }, [categoryStats, data.categories]);

    const value = {
        transactions: data.transactions,
        pendingTransactions,
        categories: data.categories,
        categoryStats,
        totalDailyAllowance,
        totalRemainingToday,
        monthSavedSoFar,
        isLoading,
        error,
        addTransaction,
        addPendingTransaction,
        confirmPendingTransaction,
        cancelPendingTransaction,
        addCategory,
        deleteTransaction
    };

    return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
    const context = useContext(BudgetContext);
    if (!context) throw new Error('useBudget must be used within a BudgetProvider');
    return context;
}
