import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { BiographyPreview } from '@/components/sections/BiographyPreview';
import { TimelinePreview } from '@/components/sections/TimelinePreview';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { Newsletter } from '@/components/sections/Newsletter';
import TypographySync from '@/components/layout/TypographySync';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch social media settings
    const settings = await prisma.siteSetting.findMany({
        where: {
            key: {
                in: ['social_facebook_embed', 'social_twitter_embed']
            }
        },
        select: { key: true, value: true }
    });

    const socialSettings = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as Record<string, string>);

    // Fetch latest gallery photos
    const photos = await prisma.galleryPhoto.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: { album: true }
    });

    const galleryImagesData = photos.map(photo => ({
        id: photo.id.toString(),
        url: photo.imageUrl,
        thumbnail: photo.imageUrl,
        title: (locale === 'hi' ? photo.captionHi : photo.captionEn) || photo.album.titleEn || '',
        titleHi: photo.captionHi || photo.album.titleHi || '',
        category: 'political-events' as const, // Default fallback
        date: photo.createdAt.toISOString(),
    }));

    return (
        <>
            <TypographySync slug="home" locale={locale} />
            <Hero />
            <BiographyPreview />
            <TimelinePreview locale={locale} />
            <GalleryPreview images={galleryImagesData} />
            <Newsletter
                facebookEmbed={socialSettings['social_facebook_embed']}
                twitterEmbed={socialSettings['social_twitter_embed']}
            />
        </>
    );
}

