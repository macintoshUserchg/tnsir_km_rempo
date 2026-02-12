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
                    <h1 className="dashboard-title">
                        {isHindi ? 'आवेदन सूची' : 'Applications'}
                    </h1>
                    <p className="dashboard-body mt-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <Link key={app.id} href={`/admin/applications/${app.id}`} className="block h-full">
                            <Card className="dashboard-card cursor-pointer group h-full flex flex-col relative">
                                {/* Status Accent Bar */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1 ${app.status === 'PENDING' ? 'bg-amber-500' :
                                    app.status === 'IN_PROGRESS' ? 'bg-purple-500' :
                                        app.status === 'RESOLVED' ? 'bg-emerald-500' :
                                            'bg-red-500'
                                    }`} />
                                <CardContent className="p-5 pl-7 flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="dashboard-section group-hover:text-orange-600 transition-colors line-clamp-1">
                                                    {app.name}
                                                </h3>
                                                <span className="dashboard-mono bg-muted px-2 py-0.5 rounded border border-border">
                                                    {app.cNumber}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 dashboard-label">
                                                <Phone className="h-3.5 w-3.5" />
                                                <span>{app.mobile}</span>
                                            </div>
                                        </div>
                                        <ApplicationStatusBadge status={app.status} locale={locale} />
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-5 bg-muted/30 p-3 rounded-lg border border-border">
                                        <div className="flex flex-col gap-1">
                                            <span className="dashboard-label uppercase tracking-wider">{isHindi ? 'विधानसभा' : 'Vidhansabha'}</span>
                                            <div className="flex items-center gap-1.5 dashboard-body font-bold text-foreground/80">
                                                <MapPin className="h-3.5 w-3.5 text-orange-600/60" />
                                                <span className="truncate">{isHindi ? app.vidhansabha.nameHi : (app.vidhansabha.nameEn || app.vidhansabha.nameHi)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="dashboard-label uppercase tracking-wider">{isHindi ? 'कार्य प्रकार' : 'Work Type'}</span>
                                            <div className="flex items-center gap-1.5 dashboard-body font-bold text-foreground/80">
                                                <FileText className="h-3.5 w-3.5 text-orange-600/60" />
                                                <span className="truncate">{isHindi ? app.workType.nameHi : (app.workType.nameEn || app.workType.nameHi)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                        <div className="dashboard-mono text-[10px] flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600/30"></span>
                                            {new Date(app.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div className="text-sm font-bold text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            {isHindi ? 'विवरण देखें' : 'View Details'}
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full">
                        <Card className="border-0 shadow-sm border-dashed border-2 border-border bg-card">
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-1">
                                    {isHindi ? 'कोई आवेदन नहीं मिला' : 'No Applications Found'}
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                    {isHindi ? 'वर्तमान फ़िल्टर के साथ कोई परिणाम नहीं मिला। कृपया फ़िल्टर बदलें या नया आवेदन जोड़ें।' : 'No results found matching your current filters. Try adjusting filters or add a new application.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
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
