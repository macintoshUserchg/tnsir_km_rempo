import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText } from 'lucide-react';
import prisma from '@/lib/db';
import { Link } from '@/i18n/navigation';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function PressReleasePage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { page = '1', search = '' } = await searchParams;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';
    const currentPage = parseInt(page);
    const itemsPerPage = 10;

    // Fetch press releases with pagination
    const where = {
        published: true,
        ...(search && {
            OR: [
                { titleHi: { contains: search, mode: 'insensitive' as const } },
                { titleEn: { contains: search, mode: 'insensitive' as const } },
            ],
        }),
    };

    const [pressReleases, totalCount] = await Promise.all([
        prisma.pressRelease.findMany({
            where,
            orderBy: { date: 'desc' },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        prisma.pressRelease.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {isHindi ? 'प्रेस विज्ञप्ति' : 'Press Releases'}
                        </h1>
                        <p className="text-xl opacity-90">
                            {isHindi
                                ? 'नवीनतम समाचार और घोषणाएं'
                                : 'Latest news and announcements'}
                        </p>
                    </div>
                </section>

                {/* Press Releases List */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-4xl">
                        {pressReleases.length > 0 ? (
                            <div className="space-y-6">
                                {pressReleases.map((release) => (
                                    <Card key={release.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(release.date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl hover:text-orange-600 transition-colors">
                                                <Link href={`/press-release/${release.slug}`}>
                                                    {isHindi ? release.titleHi : (release.titleEn || release.titleHi)}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 line-clamp-3">
                                                {isHindi
                                                    ? release.contentHi.substring(0, 200) + '...'
                                                    : (release.contentEn || release.contentHi).substring(0, 200) + '...'}
                                            </p>
                                            <div className="flex items-center gap-4 mt-4">
                                                <Link href={`/press-release/${release.slug}`}>
                                                    <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                                                        {isHindi ? 'और पढ़ें' : 'Read More'}
                                                    </Button>
                                                </Link>
                                                {release.pdfUrl && (
                                                    <a href={release.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="sm">
                                                            <FileText className="h-4 w-4 mr-1" />
                                                            PDF
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {isHindi ? 'कोई प्रेस विज्ञप्ति उपलब्ध नहीं है' : 'No press releases available'}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {currentPage > 1 && (
                                    <Link href={`/press-release?page=${currentPage - 1}`}>
                                        <Button variant="outline">{isHindi ? 'पिछला' : 'Previous'}</Button>
                                    </Link>
                                )}
                                <span className="flex items-center px-4">
                                    {currentPage} / {totalPages}
                                </span>
                                {currentPage < totalPages && (
                                    <Link href={`/press-release?page=${currentPage + 1}`}>
                                        <Button variant="outline">{isHindi ? 'अगला' : 'Next'}</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
