'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatItem {
    value: string;
    labelHi: string;
    labelEn: string;
    icon?: string;
}

interface StatsBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        stats?: StatItem[];
        columns?: number;
    };
    locale: string;
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ content, locale }) => {
    const isHindi = locale === 'hi';
    const title = isHindi ? content.titleHi : content.titleEn;
    const colCount = content.columns || 4;

    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[colCount as 1 | 2 | 3 | 4] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

    return (
        <section className="py-20 relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/40">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="container-custom relative z-10">
                {title && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500">
                            {title}
                        </h2>
                        <div className="mt-4 mx-auto w-24 h-1 bg-orange-200 dark:bg-orange-800 rounded-full" />
                    </motion.div>
                )}

                <div className={`grid ${gridCols} gap-8 md:gap-12`}>
                    {content.stats?.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-orange-500/20 transition-all active:scale-95"
                        >
                            <div className="text-4xl md:text-5xl font-black text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                                {stat.value}
                            </div>
                            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide leading-tight">
                                {isHindi ? stat.labelHi : stat.labelEn}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
