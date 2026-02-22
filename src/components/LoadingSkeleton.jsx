import React from 'react';

function SkeletonBlock({ className = '' }) {
    return <div className={`animate-pulse bg-gray-200 dark:bg-white/10 ${className}`} />;
}

export default function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            {/* Hero skeleton */}
            <div className="relative overflow-hidden rounded-[2rem] bg-white/50 dark:bg-white/[0.03] backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-8 pt-10 pb-12 shadow-sm flex flex-col items-center">
                <SkeletonBlock className="w-24 h-6 rounded-full mb-6" />
                <SkeletonBlock className="w-48 h-20 rounded-2xl mb-4" />
                <SkeletonBlock className="w-40 h-5 rounded-full" />
            </div>

            {/* Category card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="rounded-[1.5rem] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200 dark:border-white/[0.05] p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <SkeletonBlock className="w-12 h-12 rounded-2xl" />
                                <div className="space-y-2">
                                    <SkeletonBlock className="w-24 h-5 rounded-md" />
                                    <SkeletonBlock className="w-16 h-4 rounded-md" />
                                </div>
                            </div>
                        </div>
                        <SkeletonBlock className="w-20 h-8 rounded-lg mb-3" />
                        <SkeletonBlock className="w-full h-2.5 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
