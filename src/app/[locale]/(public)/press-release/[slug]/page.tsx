import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, FileText, Share2 } from 'lucide-react';
import prisma from '@/lib/db';
import { Link } from '@/i18n/navigation';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export default async function PressReleaseDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';

    const pressRelease = await prisma.pressRelease.findUnique({
        where: { slug, published: true },
    });

    if (!pressRelease) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Breadcrumb */}
                <section className="bg-gray-100 py-4 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <Link href="/press-release" className="flex items-center gap-2 text-orange-600 hover:underline">
                            <ArrowLeft className="h-4 w-4" />
                            {isHindi ? 'सभी प्रेस विज्ञप्ति' : 'All Press Releases'}
                        </Link>
                    </div>
                </section>

                {/* Content */}
                <article className="py-12 px-4">
                    <div className="container mx-auto max-w-4xl">
                        {/* Header */}
                        <header className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <Badge className="bg-orange-100 text-orange-700">
                                    {isHindi ? 'प्रेस विज्ञप्ति' : 'Press Release'}
                                </Badge>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(pressRelease.date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {isHindi ? pressRelease.titleHi : (pressRelease.titleEn || pressRelease.titleHi)}
                            </h1>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {pressRelease.pdfUrl && (
                                    <a href={pressRelease.pdfUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            <FileText className="h-4 w-4 mr-2" />
                                            {isHindi ? 'PDF डाउनलोड करें' : 'Download PDF'}
                                        </Button>
                                    </a>
                                )}
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {isHindi ? 'शेयर करें' : 'Share'}
                                </Button>
                            </div>
                        </header>

                        {/* Body */}
                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {isHindi ? pressRelease.contentHi : (pressRelease.contentEn || pressRelease.contentHi)}
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
