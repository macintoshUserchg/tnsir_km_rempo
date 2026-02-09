import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { BiographyPreview } from '@/components/sections/BiographyPreview';
import { TimelinePreview } from '@/components/sections/TimelinePreview';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { Newsletter } from '@/components/sections/Newsletter';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <Hero />
            <BiographyPreview />
            <TimelinePreview />
            <GalleryPreview />
            <Newsletter />
        </>
    );
}

