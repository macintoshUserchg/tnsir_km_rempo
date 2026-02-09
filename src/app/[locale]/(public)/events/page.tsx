import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { eventsData } from '@/data/events';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const upcomingEvents = eventsData.filter((event) => event.isUpcoming);
    const pastEvents = eventsData
        .filter((event) => !event.isUpcoming)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatCategory = (value: string) => value.replace(/-/g, ' ');

    return (
        <div className="section-padding">
            <Container>
                <SectionHeading
                    title="Events"
                    subtitle="Upcoming and past events"
                    centered
                />

                {/* Upcoming Events */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h3>
                    {upcomingEvents.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-600">
                            No upcoming events are currently listed.
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            {upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                                >
                                    {event.images[0] && (
                                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <img
                                                src={event.images[0]}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">
                                                {formatCategory(event.category)}
                                            </span>
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                                            {event.title}
                                        </h4>
                                        <p className="text-gray-600 mb-3">{event.description}</p>
                                        <p className="text-sm text-gray-500">{event.location}</p>
                                        {event.imageAttribution && (
                                            <p className="mt-4 text-sm text-gray-500">
                                                Photo:{' '}
                                                {event.imageAttribution.author && (
                                                    <span>{event.imageAttribution.author}, </span>
                                                )}
                                                via{' '}
                                                <a
                                                    href={event.imageAttribution.sourceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-orange-600 hover:text-orange-700 underline-offset-2 hover:underline"
                                                >
                                                    {event.imageAttribution.source}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Events */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h3>
                    <div className="grid gap-8 md:grid-cols-2">
                        {pastEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                            >
                                {event.images[0] && (
                                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <img
                                            src={event.images[0]}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">
                                            {formatCategory(event.category)}
                                        </span>
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        {event.title}
                                    </h4>
                                    <p className="text-gray-600 mb-3">{event.description}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span>{event.location}</span>
                                        {event.source && event.sourceUrl && (
                                            <a
                                                href={event.sourceUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-orange-600 hover:text-orange-700 underline-offset-2 hover:underline"
                                            >
                                                Source: {event.source}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};
