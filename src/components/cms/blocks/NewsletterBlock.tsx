'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface NewsletterBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        descriptionHi?: string;
        descriptionEn?: string;
        placeholderHi?: string;
        placeholderEn?: string;
        buttonTextHi?: string;
        buttonTextEn?: string;
    };
    locale: string;
}

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({ content, locale }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS'>('IDLE');
    const isHindi = locale === 'hi';

    const title = isHindi ? content.titleHi : content.titleEn;
    const description = isHindi ? content.descriptionHi : content.descriptionEn;
    const placeholder = isHindi ? content.placeholderHi : content.placeholderEn;
    const buttonText = isHindi ? content.buttonTextHi : content.buttonTextEn;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('LOADING');
        // Simulate API call or connect to actual endpoint if exists
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('SUCCESS');
            toast.success(isHindi ? 'सदस्यता सफल!' : 'Subscribed successfully!');
            setEmail('');
        } catch (error) {
            toast.error('Error subscribing');
            setStatus('IDLE');
        }
    };

    return (
        <section className="py-20 bg-orange-600 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-950 rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="inline-flex p-3 bg-orange-100 dark:bg-orange-950 rounded-2xl text-orange-600">
                                <Send className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                {title || (isHindi ? "अपडेट्स के लिए जुड़ें" : "Stay Updated")}
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400">
                                {description || (isHindi
                                    ? "नवीनतम समाचार और सूचनाएं सीधे अपने ईमेल पर प्राप्त करें।"
                                    : "Receive the latest news and updates directly in your inbox.")}
                            </p>
                        </div>

                        <div className="relative">
                            {status === 'SUCCESS' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center p-8 text-center space-y-4"
                                >
                                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {isHindi ? "धन्यवाद!" : "Thank You!"}
                                    </div>
                                    <Button variant="outline" onClick={() => setStatus('IDLE')}>
                                        {isHindi ? "वापस" : "Back"}
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            required
                                            placeholder={placeholder || (isHindi ? "अपना ईमेल दर्ज करें" : "Enter your email")}
                                            className="h-14 px-6 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 focus:border-orange-500 transition-all text-lg"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={status === 'LOADING'}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={status === 'LOADING'}
                                        className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg shadow-orange-600/20"
                                    >
                                        {status === 'LOADING' ? (
                                            <Loader2 className="animate-spin w-6 h-6" />
                                        ) : (
                                            buttonText || (isHindi ? "अभी जुड़ें" : "Subscribe Now")
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-zinc-500 mt-4">
                                        {isHindi
                                            ? "हम आपकी गोपनीयता का सम्मान करते हैं। कभी स्पैम नहीं।"
                                            : "We respect your privacy. No spam ever."}
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
