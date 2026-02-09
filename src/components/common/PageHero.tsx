'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
    title,
    subtitle,
    backgroundImage
}) => {
    return (
        <section
            className="relative py-20 md:py-28 overflow-hidden"
            style={{
                background: backgroundImage
                    ? `linear-gradient(135deg, rgba(234,88,12,0.9) 0%, rgba(249,115,22,0.85) 100%), url(${backgroundImage}) center/cover`
                    : 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
            }}
        >
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-white"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="w-full h-8 md:h-12"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        className="fill-gray-50"
                    />
                </svg>
            </div>
        </section>
    );
};
