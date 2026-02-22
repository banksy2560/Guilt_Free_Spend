import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { useToast } from '../context/ToastContext';

const ICON_OPTIONS = [
    { value: 'ShoppingCart', label: '🛒' },
    { value: 'Utensils', label: '🍽️' },
    { value: 'Coffee', label: '☕' },
    { value: 'Car', label: '🚗' },
    { value: 'Heart', label: '❤️' },
    { value: 'Gamepad2', label: '🎮' },
    { value: 'Shirt', label: '👕' },
    { value: 'Home', label: '🏠' },
    { value: 'Plane', label: '✈️' },
    { value: 'Circle', label: '⚫' },
];

export default function AddCategoryModal({ isOpen, onClose }) {
    const { addCategory } = useBudget();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [icon, setIcon] = useState('Circle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !limit) return;
        await addCategory(name, parseFloat(limit), icon);
        addToast(`"${name}" added!`, 'success');
        setName(''); setLimit(''); setIcon('Circle');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative w-full max-w-[420px] bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5"
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                            <h3 className="text-[19px] font-bold tracking-tight text-gray-900 dark:text-white font-display">New Category</h3>
                            <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors" onClick={onClose}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Groceries"
                                    className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl px-4 py-3.5 text-[17px] text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-violet-500 transition-shadow placeholder-gray-400 dark:placeholder-gray-600"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Monthly Limit ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    min="1"
                                    step="1"
                                    className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl px-4 py-3.5 text-[17px] text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-violet-500 transition-shadow placeholder-gray-400 dark:placeholder-gray-600"
                                    value={limit}
                                    onChange={e => setLimit(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Icon</label>
                                <div className="grid grid-cols-5 gap-3">
                                    {ICON_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all ${icon === opt.value
                                                    ? 'bg-violet-100 dark:bg-violet-500/20 shadow-inner border-2 border-violet-500 scale-105'
                                                    : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border-2 border-transparent hover:scale-105'
                                                }`}
                                            onClick={() => setIcon(opt.value)}
                                            title={opt.label}
                                        >
                                            <span style={{ display: 'inline-block', lineHeight: 1 }}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full mt-2 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-[17px] tracking-wide shadow-lg hover:opacity-90 transition-opacity"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Create Category
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
