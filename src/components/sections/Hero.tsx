'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    const heroImage = '/images/gallery/kirodi-home-page.jpg';

    return (
        <section
            className="relative min-h-[90vh] flex items-center overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #f5d547 0%, #f4a91f 50%, #e88b1a 100%)',
            }}
        >
            {/* Background Pattern */}

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
                        >
                            Cabinet Minister, Government of Rajasthan
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        >
                            Dr. Kirodi Lal Meena
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-xl md:text-2xl mb-4 text-white/90 font-medium"
                        >
                            BJP Leader and Public Servant
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-lg mb-8 text-white/80 max-w-xl"
                        >
                            Serving Rajasthan through legislative leadership and public service,
                            with a focus on agriculture, rural development, and community well-being.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/biography">
                                <Button
                                    size="lg"
                                    className="bg-white text-orange-600 hover:bg-gray-100"
                                    icon={<ArrowRight className="w-5 h-5" />}
                                >
                                    Learn More
                                </Button>
                            </Link>
                            <Link href="/media/video-gallery">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-orange-600"
                                    icon={<Play className="w-5 h-5" />}
                                >
                                    Watch Videos
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
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
                                    alt="Dr. Kirodi Lal Meena"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
