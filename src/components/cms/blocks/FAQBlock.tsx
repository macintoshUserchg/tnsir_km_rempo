'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
    questionHi: string;
    questionEn: string;
    answerHi: string;
    answerEn: string;
}

interface FAQBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        items?: FAQItem[];
    };
    locale: string;
}

export default function FAQBlock({ content, locale }: FAQBlockProps) {
    const isHindi = locale === 'hi';
    const title = isHindi ? content.titleHi : content.titleEn;
    const items = content.items || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    {(content.titleHi || content.titleEn) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 mb-4">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                {title}
                            </h2>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "border border-border/40 rounded-2xl overflow-hidden transition-all duration-300",
                                    openIndex === index ? "bg-muted/30 shadow-sm ring-1 ring-orange-500/20" : "bg-card hover:bg-muted/10 hover:border-orange-500/30"
                                )}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-lg pr-8 leading-tight">
                                        {isHindi ? item.questionHi : item.questionEn}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className={cn(
                                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                            openIndex === index ? "bg-orange-600 text-white" : "bg-muted"
                                        )}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-6 pt-0">
                                                <div className="border-t border-border/40 pt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                                                    {isHindi ? item.answerHi : item.answerEn}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        </section>
    );
}
