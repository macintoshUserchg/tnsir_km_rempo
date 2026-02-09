'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { timelineData } from '@/data/timeline';
import { useLocale } from 'next-intl';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JourneyPage() {
    const locale = useLocale();
    const isHindi = locale === 'hi';

    const getCategoryStyle = (category: string) => {
        switch (category) {
            case 'political':
                return 'bg-orange-100 text-orange-700';
            case 'education':
                return 'bg-blue-100 text-blue-700';
            case 'achievement':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryLabel = (category: string) => {
        if (isHindi) {
            switch (category) {
                case 'political':
                    return 'राजनीतिक';
                case 'education':
                    return 'शिक्षा';
                case 'achievement':
                    return 'उपलब्धि';
                default:
                    return category;
            }
        }
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <>
            <PageHero
                title={isHindi ? 'यात्रा' : 'Journey'}
                subtitle={isHindi ? 'समर्पण और सेवा की समयरेखा' : 'A timeline of dedication and service'}
            />

            <section className="py-12 md:py-16">
                <Container>
                    <div className="max-w-5xl mx-auto">
                        <div className="relative">
                            {/* Timeline Line */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="absolute left-8 md:left-1/2 top-0 w-1 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-300 origin-top"
                            />

                            {/* Timeline Events */}
                            <StaggerContainer className="space-y-16" staggerDelay={0.15}>
                                {timelineData.map((event, index) => (
                                    <StaggerItem key={event.id}>
                                        <div
                                            className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                                }`}
                                        >
                                            {/* Timeline Dot */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                                className="absolute left-8 md:left-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 z-10"
                                            />

                                            {/* Content */}
                                            <div
                                                className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 pl-20' : 'md:pl-16 pl-20'
                                                    }`}
                                            >
                                                <motion.div
                                                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                                    className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-gray-100"
                                                >
                                                    <div className="flex items-center gap-2 text-orange-600 font-bold mb-3">
                                                        <Calendar className="w-5 h-5" />
                                                        <span className="text-2xl">{event.year}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                        {isHindi && event.titleHi ? event.titleHi : event.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {isHindi && event.descriptionHi ? event.descriptionHi : event.description}
                                                    </p>
                                                    <div className="mt-4">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyle(
                                                                event.category
                                                            )}`}
                                                        >
                                                            {getCategoryLabel(event.category)}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
