'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/common/Container';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    message: string;
    imageUrl: string | null;
}

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
    title?: string;
    subtitle?: string;
}

export default function TestimonialsCarousel({ testimonials, title, subtitle }: TestimonialsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    if (testimonials.length === 0) return null;

    return (
        <section className="py-16 bg-orange-50/50">
            <Container>
                {(title || subtitle) && (
                    <div className="text-center mb-12">
                        {title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>}
                        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                )}

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute top-0 left-0 -translate-x-12 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                        <Button variant="ghost" size="icon" onClick={prev} className="rounded-full hover:bg-orange-100">
                            <ChevronLeft className="w-6 h-6 text-orange-600" />
                        </Button>
                    </div>

                    <div className="absolute top-0 right-0 translate-x-12 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                        <Button variant="ghost" size="icon" onClick={next} className="rounded-full hover:bg-orange-100">
                            <ChevronRight className="w-6 h-6 text-orange-600" />
                        </Button>
                    </div>

                    <div className="overflow-hidden px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-orange-100 text-center relative"
                            >
                                <Quote className="w-12 h-12 text-orange-200 mx-auto mb-6" />
                                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                                    "{testimonials[currentIndex].message}"
                                </p>
                                <div className="flex flex-col items-center">
                                    {testimonials[currentIndex].imageUrl ? (
                                        <img
                                            src={testimonials[currentIndex].imageUrl}
                                            alt={testimonials[currentIndex].name}
                                            className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-orange-100"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 text-orange-600 font-bold text-xl">
                                            {testimonials[currentIndex].name.charAt(0)}
                                        </div>
                                    )}
                                    <h4 className="font-bold text-gray-900">{testimonials[currentIndex].name}</h4>
                                    {testimonials[currentIndex].role && (
                                        <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center mt-8 gap-2">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-orange-600 w-6' : 'bg-orange-200 hover:bg-orange-300'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
