import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Search, Filter, FileText, User, Phone, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import prisma from '@/lib/db';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';
import ApplicationSearch from '@/components/admin/ApplicationSearch';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; status?: string; vidhansabha?: string; query?: string }>;
};

export default async function ApplicationsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { page = '1', status, vidhansabha, query } = await searchParams;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';
    const currentPage = parseInt(page);
    const itemsPerPage = 15;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') {
        where.status = status;
    }
    if (vidhansabha && vidhansabha !== 'ALL') {
        where.vidhansabhaId = parseInt(vidhansabha);
    }
    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { fatherName: { contains: query, mode: 'insensitive' } },
            { mobile: { contains: query, mode: 'insensitive' } },
            { cNumber: { contains: query, mode: 'insensitive' } },
        ];
    }

    // Fetch applications
    const [applications, totalCount, vidhansabhas, statusStats] = await Promise.all([
        prisma.citizenApp.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            include: {
                vidhansabha: true,
                workType: true,
            },
        }),
        prisma.citizenApp.count({ where }),
        prisma.vidhansabha.findMany(),
        prisma.citizenApp.groupBy({
            by: ['status'],
            _count: true,
        }),
    ]);

    const statusCounts = statusStats.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
    }, {} as Record<string, number>);

    // Calculate total count properly
    const totalStatusCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    statusCounts['ALL'] = totalStatusCount;

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {isHindi ? 'आवेदन सूची' : 'Applications'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isHindi ? `कुल ${totalCount} आवेदन` : `Total ${totalCount} applications`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/api/export/applications" target="_blank">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            {isHindi ? 'Excel निर्यात' : 'Export Excel'}
                        </Button>
                    </a>
                    <Link href="/admin/applications/new">
                        <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                            <Plus className="h-4 w-4" />
                            {isHindi ? 'नया आवेदन' : 'New Application'}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
                <ApplicationSearch locale={locale} statusCounts={statusCounts} />
            </div>

            {/* Applications Grid/List */}
            <div className="space-y-3">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <Link key={app.id} href={`/admin/applications/${app.id}`}>
                            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <CardContent className="p-0">
                                    <div className="flex items-center">
                                        {/* Left Color Bar */}
                                        <div className={`w-1.5 self-stretch rounded-l-xl ${app.status === 'PENDING' ? 'bg-amber-500' :
                                            app.status === 'IN_PROGRESS' ? 'bg-purple-500' :
                                                app.status === 'RESOLVED' ? 'bg-emerald-500' :
                                                    'bg-red-500'
                                            }`} />

                                        <div className="flex-1 p-5 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                {/* Avatar */}
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-5 w-5 text-gray-500" />
                                                </div>

                                                {/* Info */}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                                            {app.name}
                                                        </h3>
                                                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                            {app.cNumber}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="h-3.5 w-3.5" />
                                                            {app.mobile}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {isHindi ? app.vidhansabha.nameHi : (app.vidhansabha.nameEn || app.vidhansabha.nameHi)}
                                                        </span>
                                                        <span className="hidden sm:inline-flex items-center gap-1">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            {isHindi ? app.workType.nameHi : (app.workType.nameEn || app.workType.nameHi)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side */}
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-right">
                                                    <ApplicationStatusBadge status={app.status} locale={locale} />
                                                    <p className="text-xs text-gray-400 mt-1.5">
                                                        {new Date(app.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <Eye className="h-5 w-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                                {isHindi ? 'कोई आवेदन नहीं मिला' : 'No applications found'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {isHindi ? 'इस फ़िल्टर के लिए कोई आवेदन नहीं है' : 'There are no applications for this filter'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/applications?page=${Math.max(1, currentPage - 1)}${status ? `&status=${status}` : ''}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            className="gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {isHindi ? 'पिछला' : 'Previous'}
                        </Button>
                    </Link>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <Link key={pageNum} href={`/admin/applications?page=${pageNum}${status ? `&status=${status}` : ''}`}>
                                    <Button
                                        variant={currentPage === pageNum ? 'default' : 'ghost'}
                                        size="sm"
                                        className={`w-10 ${currentPage === pageNum ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                                    >
                                        {pageNum}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    <Link href={`/admin/applications?page=${Math.min(totalPages, currentPage + 1)}${status ? `&status=${status}` : ''}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            className="gap-1"
                        >
                            {isHindi ? 'अगला' : 'Next'}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
