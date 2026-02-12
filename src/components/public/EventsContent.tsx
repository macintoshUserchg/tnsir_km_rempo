'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { useTranslations } from 'next-intl';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    images: string[];
    isUpcoming: boolean;
}

interface EventsContentProps {
    upcomingEvents: Event[];
    pastEvents: Event[];
    isHindi: boolean;
}

export default function EventsContent({ upcomingEvents, pastEvents, isHindi }: EventsContentProps) {
    // We can use translations here if needed, or pass strings from server
    // For now I'll use the isHindi prop for conditional text to match previous logic

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatCategory = (value: string) => value.replace(/-/g, ' ');

    return (
        <>
            <PageHero
                title={isHindi ? 'कार्यक्रम' : 'Events'}
                subtitle={isHindi ? 'आगामी और पिछले कार्यक्रम' : 'Upcoming and past events'}
            />

            <section className="py-12 md:py-16">
                <Container>
                    {/* Upcoming Events */}
                    <AnimatedSection delay={0.1} className="mb-16">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-green-600" />
                            </span>
                            {isHindi ? 'आगामी कार्यक्रम' : 'Upcoming Events'}
                        </h3>
                        {upcomingEvents.length === 0 ? (
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 text-center border border-orange-100">
                                <p className="text-gray-600 text-lg">
                                    {isHindi ? 'कोई आगामी कार्यक्रम नहीं है।' : 'No upcoming events are currently listed.'}
                                </p>
                            </div>
                        ) : (
                            <StaggerContainer className="grid gap-8 md:grid-cols-2">
                                {upcomingEvents.map((event) => (
                                    <StaggerItem key={event.id}>
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 hover:shadow-xl transition-all hover:-translate-y-1">
                                            {event.images[0] && (
                                                <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                                                    <img
                                                        src={event.images[0]}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-sm font-semibold shadow-lg">
                                                            {isHindi ? 'आगामी' : 'Upcoming'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium capitalize">
                                                        {formatCategory(event.category)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(event.date)}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                    {event.title}
                                                </h4>
                                                <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-orange-500" />
                                                    {event.location}
                                                </p>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        )}
                    </AnimatedSection>

                    {/* Past Events */}
                    <AnimatedSection delay={0.3}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-gray-600" />
                            </span>
                            {isHindi ? 'पिछले कार्यक्रम' : 'Past Events'}
                        </h3>
                        <StaggerContainer className="grid gap-8 md:grid-cols-2">
                            {pastEvents.map((event) => (
                                <StaggerItem key={event.id}>
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                                        {event.images[0] && (
                                            <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                                                <img
                                                    src={event.images[0]}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover grayscale-[30%]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium capitalize">
                                                    {formatCategory(event.category)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(event.date)}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                {event.title}
                                            </h4>
                                            <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                                            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-orange-500" />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </AnimatedSection>
                </Container>
            </section>
        </>
    );
}
