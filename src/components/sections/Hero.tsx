'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    const t = useTranslations('home');
    const heroImage = '/images/gallery/kirodi-home-page.jpg';

    return (
        <section
            className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden py-8 md:py-0"
            style={{
                background: 'linear-gradient(135deg, #f5d547 0%, #f4a91f 50%, #e88b1a 100%)',
            }}
        >
            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Mobile Image - Show at top on mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="lg:hidden order-first"
                    >
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
                            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                            <div className="absolute inset-2 bg-white/30 rounded-full overflow-hidden">
                                <img
                                    src={heroImage}
                                    alt={t('name')}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 text-white"
                        >
                            {t('designation')}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 md:mb-6 leading-tight text-white"
                        >
                            {t('name')}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 text-white font-bold"
                        >
                            {t('role')}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 text-white/90 max-w-xl mx-auto lg:mx-0 font-bold"
                        >
                            {t('description')}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                        >
                            <Link href="/biography">
                                <Button
                                    size="lg"
                                    className="bg-white text-orange-600 hover:bg-gray-100 w-full sm:w-auto text-sm md:text-base"
                                    icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                                >
                                    {t('buttons.learnMore')}
                                </Button>
                            </Link>
                            <Link href="/video-gallery">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-orange-600 w-full sm:w-auto text-sm md:text-base"
                                    icon={<Play className="w-4 h-4 md:w-5 md:h-5" />}
                                >
                                    {t('buttons.watchVideos')}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Desktop Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full h-[600px]">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl transform -rotate-3"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
                                <img
                                    src={heroImage}
                                    alt={t('name')}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator - Hidden on mobile */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
            >
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
};
