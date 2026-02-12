'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BiographyBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        contentHi?: string;
        contentEn?: string;
        imageUrl?: string;
        stats?: Array<{ labelHi: string, labelEn: string, value: string }>;
    };
    locale: string;
}

export const BiographyBlock: React.FC<BiographyBlockProps> = ({ content, locale }) => {
    const isHindi = locale === 'hi';
    const title = isHindi ? content.titleHi : content.titleEn;
    const bioText = isHindi ? content.contentHi : content.contentEn;

    return (
        <section className="py-20 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-8 border-orange-50/50 dark:border-zinc-900/50 shadow-2xl">
                            <img
                                src={content.imageUrl || '/images/biography.jpg'}
                                alt={title || "Biography"}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent"></div>
                        </div>

                        {/* Decorative Badge */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-600 rounded-full flex items-center justify-center text-white p-4 text-center text-xs font-bold border-4 border-white dark:border-zinc-950 shadow-xl hidden md:flex">
                            {isHindi ? "40+ साल का संघर्ष और जनसेवा" : "40+ Years of Public Service"}
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <span className="inline-block py-1 px-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold uppercase tracking-widest">
                                {isHindi ? "परिचय" : "Biography"}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                {title || (isHindi ? "डॉ. किरोड़ी लाल मीणा" : "Dr. Kirodi Lal Meena")}
                            </h2>
                            <div className="w-20 h-1.5 bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
                            dangerouslySetInnerHTML={{ __html: bioText || '' }}
                        />

                        {content.stats && content.stats.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {content.stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="p-4 rounded-2xl bg-orange-50/50 dark:bg-zinc-900/50 border border-orange-100/50 dark:border-zinc-800"
                                    >
                                        <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
                                        <div className="text-sm font-medium text-zinc-500">{isHindi ? stat.labelHi : stat.labelEn}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
