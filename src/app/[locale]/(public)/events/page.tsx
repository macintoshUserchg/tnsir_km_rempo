import React from 'react';
import EventsContent from '@/components/public/EventsContent';
import { prisma } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

async function getEvents(isHindi: boolean) {
    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' }
    });

    return events.map(event => ({
        id: event.id,
        title: (isHindi ? event.titleHi : event.titleEn) || event.titleHi,
        description: (isHindi ? event.descriptionHi : event.descriptionEn) || '',
        date: event.date.toISOString(),
        location: (isHindi ? event.locationHi : event.locationEn) || '',
        category: event.category,
        images: event.images,
        isUpcoming: event.isUpcoming,
    }));
}

export default async function EventsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';
    const events = await getEvents(isHindi);

    const upcomingEvents = events.filter(e => e.isUpcoming);
    const pastEvents = events.filter(e => !e.isUpcoming);

    return (
        <EventsContent
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
            isHindi={isHindi}
        />
    );
}
