import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Newspaper, Calendar, FileText, ExternalLink } from 'lucide-react';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function PressReleasesAdminPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    const pressReleases = await prisma.pressRelease.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    const publishedCount = pressReleases.filter(pr => pr.published).length;
    const draftCount = pressReleases.length - publishedCount;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {isHindi ? 'प्रेस विज्ञप्ति प्रबंधन' : 'Press Releases'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isHindi ? `कुल ${pressReleases.length} प्रेस विज्ञप्ति` : `Total ${pressReleases.length} press releases`}
                    </p>
                </div>
                <Link href="/admin/press-releases/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                        <Plus className="h-4 w-4" />
                        {isHindi ? 'नई प्रेस विज्ञप्ति' : 'New Release'}
                    </Button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Newspaper className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{pressReleases.length}</p>
                            <p className="text-sm text-gray-500">{isHindi ? 'कुल' : 'Total'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                            <p className="text-sm text-gray-500">{isHindi ? 'प्रकाशित' : 'Published'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm sm:col-span-1 col-span-2">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
                            <p className="text-sm text-gray-500">{isHindi ? 'ड्राफ्ट' : 'Drafts'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Press Releases List */}
            <div className="space-y-3">
                {pressReleases.length > 0 ? (
                    pressReleases.map((pr) => (
                        <Card key={pr.id} className="border-0 shadow-sm hover:shadow-md transition-all group">
                            <CardContent className="p-0">
                                <div className="flex items-center">
                                    {/* Left Color Bar */}
                                    <div className={`w-1.5 self-stretch rounded-l-xl ${pr.published ? 'bg-emerald-500' : 'bg-gray-300'}`} />

                                    <div className="flex-1 p-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Newspaper className="h-5 w-5 text-gray-500" />
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                                    {isHindi ? pr.titleHi : (pr.titleEn || pr.titleHi)}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(pr.date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                    {pr.pdfUrl && (
                                                        <span className="flex items-center gap-1 text-red-600">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            PDF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Badge
                                                variant={pr.published ? 'default' : 'secondary'}
                                                className={pr.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                                            >
                                                {pr.published ? (isHindi ? 'प्रकाशित' : 'Published') : (isHindi ? 'ड्राफ्ट' : 'Draft')}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Link href={`/press-release/${pr.slug}`} target="_blank">
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                                        <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/press-releases/${pr.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                                        <Edit className="h-4 w-4 text-gray-400 hover:text-orange-600" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Newspaper className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                                {isHindi ? 'कोई प्रेस विज्ञप्ति नहीं मिली' : 'No press releases found'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {isHindi ? 'नई प्रेस विज्ञप्ति जोड़ें' : 'Add a new press release'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
