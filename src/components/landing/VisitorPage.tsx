'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface VisitorPageProps {
    onEnter: () => void;
}

export default function VisitorPage({ onEnter }: VisitorPageProps) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/kirodi-lal-meena.jpg"
                    alt="Dr. Kirodi Lal Meena"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-between px-6 py-12 md:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <h2 className="text-orange-500 font-bold text-xl tracking-widest">KM</h2>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                            DR. KIRODI LAL MEENA
                        </h1>
                        <p className="text-orange-400 text-lg md:text-xl font-medium mt-2">
                            Cabinet Minister, Rajasthan
                        </p>
                    </div>
                </motion.div>

                {/* Main Text */}
                <div className="flex flex-col justify-center flex-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="space-y-2 md:space-y-4"
                    >
                        <p className="text-xl md:text-2xl font-light text-gray-300">To Create</p>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                            Growth
                        </h2>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                            <span className="text-orange-500">Opportunities</span>
                        </h2>
                        <p className="text-xl md:text-2xl font-light text-gray-300 max-w-md mt-4">
                            for all Citizens in every <br />
                            <span className="font-semibold text-white">Aspect of Life.</span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="mt-8 md:mt-12"
                    >
                        <p className="text-lg text-gray-400 mb-6">- Bharatiya Janata Party</p>

                        <button
                            onClick={onEnter}
                            className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                        >
                            Enter Website
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-gray-500 text-sm"
                >
                    © 2026 All Rights Reserved
                </motion.div>
            </div>
        </div>
    );
}
