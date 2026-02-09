import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Phone, Newspaper } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <HomeContent locale={locale} />
            </main>
            <Footer />
        </div>
    );
}

function HomeContent({ locale }: { locale: string }) {
    const t = useTranslations();

    const quickLinks = [
        {
            icon: FileText,
            title: t('common.apply'),
            href: '/apply',
            description: locale === 'hi' ? 'आवेदन पत्र जमा करें' : 'Submit application form'
        },
        {
            icon: Users,
            title: t('common.biography'),
            href: '/biography',
            description: locale === 'hi' ? 'जीवन परिचय' : 'Life story'
        },
        {
            icon: Newspaper,
            title: t('common.pressRelease'),
            href: '/press-release',
            description: locale === 'hi' ? 'ताज़ा समाचार' : 'Latest news'
        },
        {
            icon: Phone,
            title: t('common.contact'),
            href: '/contact',
            description: locale === 'hi' ? 'संपर्क करें' : 'Get in touch'
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {t('home.heroTitle')}
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 mb-8">
                        {t('home.heroSubtitle')}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/apply">{t('common.apply')}</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                            <Link href="/biography">{t('common.biography')}</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t('home.quickLinks')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickLinks.map((link, index) => (
                            <Link key={index} href={link.href}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-orange-500">
                                    <CardHeader className="text-center">
                                        <link.icon className="h-12 w-12 mx-auto text-orange-500 mb-2" />
                                        <CardTitle>{link.title}</CardTitle>
                                        <CardDescription>{link.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        {t('home.welcomeMessage')}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t('common.siteName')}
                    </p>
                </div>
            </section>
        </>
    );
}
