import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

export default function EmptyState({ onAddCategory }) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-20 px-6 text-center select-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="w-24 h-24 mb-6 rounded-[2rem] bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-500/20 dark:to-fuchsia-500/20 flex items-center justify-center shadow-inner border border-white/50 dark:border-white/5">
                <span className="text-5xl drop-shadow-sm">💸</span>
            </div>

            <h2 className="text-[22px] font-bold font-display text-gray-900 dark:text-white tracking-tight mb-3">
                Set Up Your Budget
            </h2>

            <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 max-w-[280px] mb-8 leading-relaxed">
                Add your first category and start seeing your daily allowance instantly.
            </p>

            <motion.button
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.1)] hover:shadow-xl hover:opacity-90 transition-all active:scale-95"
                onClick={onAddCategory}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <PlusCircle size={18} strokeWidth={2.5} />
                <span>Add First Category</span>
            </motion.button>
        </motion.div>
    );
}
