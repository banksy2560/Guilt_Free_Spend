import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { isCurrentMonth } from '../utils/date-math';

const CATEGORY_COLORS = ['#A78BFA', '#F472B6', '#34D399', '#60A5FA', '#FBBF24'];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl rounded-[1.2rem] p-4 min-w-[140px]">
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2 opacity-80">Day {label}</p>
            <div className="flex flex-col gap-1.5">
                {payload.map(p => (
                    <div key={p.dataKey} className="flex justify-between items-center gap-5 text-[14px] font-semibold">
                        <span style={{ color: p.color }}>{p.name}</span>
                        <span className="text-gray-900 dark:text-white">${p.value.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SpendingHistoryChart() {
    const { transactions, categories } = useBudget();

    const chartData = useMemo(() => {
        const today = new Date();
        const currentMonthTxs = transactions.filter(tx => isCurrentMonth(tx.date));

        return Array.from({ length: today.getDate() }, (_, i) => {
            const day = i + 1;
            const entry = { day };
            categories.forEach(cat => {
                entry[cat.name] = currentMonthTxs
                    .filter(tx => tx.categoryId === cat.id && new Date(tx.date).getDate() === day)
                    .reduce((sum, tx) => sum + tx.amount, 0);
            });
            return entry;
        });
    }, [transactions, categories]);

    if (chartData.length === 0 || categories.length === 0) return null;

    return (
        <div className="flex flex-col mt-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-3 px-2">This Month's Spending</h2>
            <div className="bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200 dark:border-white/[0.05] rounded-[2rem] p-4 pt-6 shadow-sm dark:shadow-none transition-all duration-300">
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData} margin={{ top: 0, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(150,150,150,0.15)" />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: '#888', fontSize: 11, fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={v => `$${v}`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(150,150,150,0.2)', strokeWidth: 2 }} />
                        <Legend
                            wrapperStyle={{ fontSize: '13px', fontWeight: 500, paddingTop: '15px' }}
                            iconType="circle"
                            iconSize={8}
                        />
                        {categories.map((cat, i) => (
                            <Line
                                key={cat.id}
                                type="monotone"
                                dataKey={cat.name}
                                stroke={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0, fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
