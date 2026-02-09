'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { biographyData } from '@/data/biography';

export const SplashScreen: React.FC = () => {
    const t = useTranslations('common');
    const locale = useLocale();
    const [showSplash, setShowSplash] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if user has already seen the splash screen
        const hasSeenSplash = localStorage.getItem('hasSeenSplash');

        if (!hasSeenSplash) {
            setShowSplash(true);
        }
    }, []);

    const handleEnterWebsite = () => {
        // Mark that user has seen the splash screen
        localStorage.setItem('hasSeenSplash', 'true');
        setShowSplash(false);
    };

    const splashData = {
        title: locale === 'hi' ? 'डॉ. किरोड़ी लाल मीणा' : 'DR. KIRODI LAL MEENA',
        designation: locale === 'hi' ? 'कैबिनेट मंत्री, राजस्थान' : 'Cabinet Minister, Rajasthan',
        mission: {
            prefix: locale === 'hi' ? 'निर्माण करने के लिए' : 'To Create',
            growth: locale === 'hi' ? 'विकास' : 'Growth',
            opportunities: locale === 'hi' ? 'के अवसर' : 'Opportunities',
            suffix1: locale === 'hi' ? 'सभी के लिए' : 'for all',
            citizens: locale === 'hi' ? 'नागरिक' : 'Citizens',
            suffix2: locale === 'hi' ? 'जीवन के हर' : 'in every',
            aspect: locale === 'hi' ? 'पहलू' : 'Aspect',
            ofLife: locale === 'hi' ? 'में।' : 'of Life.',
        },
        party: locale === 'hi' ? '- भारतीय जनता पार्टी' : '- Bharatiya Janata Party',
        enter: locale === 'hi' ? 'वेबसाइट पर जाएं' : 'Enter Website',
    };

    if (!isMounted || !showSplash) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0"
                style={{
                    background: 'linear-gradient(135deg, #f5d547 0%, #f4a91f 50%, #e88b1a 100%)',
                }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center justify-center min-h-screen py-8 sm:py-12 lg:py-0">
                        {/* Left Side - Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="w-full flex justify-center lg:justify-end order-1 lg:order-1"
                        >
                            <div className="relative w-48 sm:w-56 md:w-64 lg:w-80">
                                <div className="aspect-[3/4] bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={biographyData.profileImage}
                                        alt={splashData.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="w-full text-center lg:text-left order-2 lg:order-2"
                        >
                            {/* Logo/Header */}
                            <div className="mb-3 sm:mb-4 lg:mb-6">
                                <div className="flex flex-col sm:flex-row items-center gap-2 justify-center lg:justify-start">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                        <span className="text-primary-700 font-bold text-lg sm:text-xl text-orange-700">KM</span>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h1 className="text-base sm:text-lg lg:text-xl font-heading font-bold text-[#5d3a1a] leading-tight">
                                            {splashData.title}
                                        </h1>
                                        <p className="text-xs text-[#6b4423] font-medium mt-0.5">
                                            {splashData.designation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Statement */}
                            <div className="mb-4 sm:mb-6 border-l-4 border-[#8b4513] pl-3 sm:pl-4 lg:pl-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-r-lg shadow-lg max-w-xl mx-auto lg:mx-0">
                                <p className="text-xs sm:text-sm lg:text-base text-[#5d3a1a] mb-0.5 font-medium">{splashData.mission.prefix}</p>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-[#4a2c14] mb-0.5 leading-tight">
                                    {splashData.mission.growth}
                                </h2>
                                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-heading font-bold text-[#4a2c14] mb-0.5 leading-tight">
                                    {splashData.mission.opportunities}
                                </h3>
                                <p className="text-xs sm:text-sm lg:text-base text-[#5d3a1a] mb-0.5">
                                    {splashData.mission.suffix1} <span className="text-base sm:text-lg lg:text-xl font-bold text-[#4a2c14]">{splashData.mission.citizens}</span> {splashData.mission.suffix2}
                                </p>
                                <p className="text-xs sm:text-sm lg:text-base text-[#5d3a1a]">
                                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#4a2c14]">{splashData.mission.aspect}</span>{' '}
                                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#4a2c14]">{splashData.mission.ofLife}</span>
                                </p>
                                <p className="text-xs text-[#6b4423] mt-2 font-medium italic">
                                    {splashData.party}
                                </p>
                            </div>

                            {/* Enter Website Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEnterWebsite}
                                className="inline-flex items-center gap-2 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base rounded-md shadow-xl transition-all duration-300 mx-auto lg:mx-0"
                            >
                                {splashData.enter}
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>

                            {/* Footer */}
                            <div className="mt-4 sm:mt-6 text-xs text-[#6b4423]">
                                <p>© 2026 All Rights Reserved</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
