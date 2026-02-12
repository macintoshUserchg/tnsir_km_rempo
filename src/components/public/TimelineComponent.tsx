'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { motion } from 'framer-motion';

interface TimelineEvent {
    id: number;
    year: number;
    title: string;
    description: string;
    imageUrl: string | null;
}

interface TimelineComponentProps {
    events: TimelineEvent[];
    title: string;
}

export default function TimelineComponent({ events, title }: TimelineComponentProps) {
    if (events.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                    <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full" />
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-orange-200 -translate-x-1/2" />

                    <div className="space-y-12">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content Side */}
                                <div className="md:w-1/2 md:px-12 pl-12 pr-4">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                                        {/* Mobile Dot */}
                                        <div className="absolute left-[-3.25rem] md:hidden top-6 w-5 h-5 rounded-full border-4 border-white bg-orange-600 shadow-sm z-10" />

                                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-3">
                                            {event.year}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                        <div dangerouslySetInnerHTML={{ __html: event.description }} className="prose prose-sm text-gray-600" />
                                        {event.imageUrl && (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="mt-4 rounded-lg w-full h-48 object-cover"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Center Dot (Desktop) */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-8 hidden md:block w-5 h-5 rounded-full border-4 border-white bg-orange-600 shadow-sm z-10" />

                                {/* Empty Side */}
                                <div className="md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
