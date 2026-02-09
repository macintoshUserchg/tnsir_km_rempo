import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { BiographyPreview } from '@/components/sections/BiographyPreview';
import { TimelinePreview } from '@/components/sections/TimelinePreview';
import { Newsletter } from '@/components/sections/Newsletter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow pt-16">
                <Hero />
                <BiographyPreview />
                <TimelinePreview />
                <Newsletter />
            </div>
            <Footer />
        </main>
    );
}
