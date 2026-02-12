'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroBlockProps {
    content: {
        titleHi?: string;
        titleEn?: string;
        descriptionHi?: string;
        descriptionEn?: string;
        imageUrl?: string;
        show?: boolean;
    };
    locale: string;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ content, locale }) => {
    const isHindi = locale === 'hi';
    const title = isHindi ? content.titleHi : content.titleEn;
    const description = isHindi ? content.descriptionHi : content.descriptionEn;
    const heroImage = content.imageUrl || '/images/gallery/kirodi-home-page.jpg';

    return (
        <section
            className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden py-12 md:py-0"
            style={{
                background: 'linear-gradient(135deg, #f5d547 0%, #f4a91f 50%, #e88b1a 100%)',
            }}
        >
            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Image Block */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-last lg:order-last"
                    >
                        <div className="relative w-full max-w-[500px] aspect-square mx-auto">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6 hidden lg:block"></div>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl transform -rotate-3 hidden lg:block"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                                <img
                                    src={heroImage}
                                    alt={title || "Hero Image"}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-amber-950 text-center lg:text-left"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
                            style={{ fontSize: 'var(--site-hero-title-size)' }}
                        >
                            {title || (isHindi ? "शीर्षक यहां" : "Title Here")}
                        </motion.h1>

                        {description && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-amber-900/90 font-medium"
                                style={{ fontSize: 'var(--site-hero-desc-size)' }}
                            >
                                {description}
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2 pointer-events-none" />
        </section>
    );
};
