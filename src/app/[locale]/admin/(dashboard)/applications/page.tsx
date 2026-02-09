import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download } from 'lucide-react';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; status?: string; vidhansabha?: string }>;
};

export default async function ApplicationsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { page = '1', status, vidhansabha } = await searchParams;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';
    const currentPage = parseInt(page);
    const itemsPerPage = 15;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) {
        where.status = status;
    }
    if (vidhansabha) {
        where.vidhansabhaId = parseInt(vidhansabha);
    }

    // Fetch applications
    const [applications, totalCount, vidhansabhas] = await Promise.all([
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
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        IN_PROGRESS: 'bg-blue-100 text-blue-700',
        RESOLVED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700',
    };

    const statusLabels: Record<string, Record<string, string>> = {
        PENDING: { hi: 'लंबित', en: 'Pending' },
        IN_PROGRESS: { hi: 'प्रगति में', en: 'In Progress' },
        RESOLVED: { hi: 'समाधान', en: 'Resolved' },
        REJECTED: { hi: 'अस्वीकृत', en: 'Rejected' },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isHindi ? 'आवेदन सूची' : 'Applications'}
                    </h1>
                    <p className="text-gray-500">
                        {isHindi ? `कुल ${totalCount} आवेदन` : `Total ${totalCount} applications`}
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {isHindi ? 'निर्यात' : 'Export'}
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-2">
                            {['', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((s) => (
                                <Link
                                    key={s}
                                    href={`/admin/applications${s ? `?status=${s}` : ''}`}
                                >
                                    <Badge
                                        variant={status === s || (!status && !s) ? 'default' : 'outline'}
                                        className="cursor-pointer"
                                    >
                                        {s ? (isHindi ? statusLabels[s].hi : statusLabels[s].en) : (isHindi ? 'सभी' : 'All')}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Applications Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{isHindi ? 'क्रमांक' : 'C.No.'}</TableHead>
                                <TableHead>{isHindi ? 'नाम' : 'Name'}</TableHead>
                                <TableHead>{isHindi ? 'विधानसभा' : 'Vidhansabha'}</TableHead>
                                <TableHead>{isHindi ? 'कार्य प्रकार' : 'Work Type'}</TableHead>
                                <TableHead>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
                                <TableHead>{isHindi ? 'दिनांक' : 'Date'}</TableHead>
                                <TableHead>{isHindi ? 'क्रियाएँ' : 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-mono text-sm">{app.cNumber}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{app.name}</p>
                                            <p className="text-xs text-gray-500">{app.mobile}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {isHindi ? app.vidhansabha.nameHi : (app.vidhansabha.nameEn || app.vidhansabha.nameHi)}
                                    </TableCell>
                                    <TableCell>
                                        {isHindi ? app.workType.nameHi : (app.workType.nameEn || app.workType.nameHi)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[app.status]}>
                                            {isHindi ? statusLabels[app.status].hi : statusLabels[app.status].en}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(app.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/applications/${app.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {currentPage > 1 && (
                        <Link href={`/admin/applications?page=${currentPage - 1}${status ? `&status=${status}` : ''}`}>
                            <Button variant="outline" size="sm">{isHindi ? 'पिछला' : 'Previous'}</Button>
                        </Link>
                    )}
                    <span className="flex items-center px-4 text-sm text-gray-600">
                        {currentPage} / {totalPages}
                    </span>
                    {currentPage < totalPages && (
                        <Link href={`/admin/applications?page=${currentPage + 1}${status ? `&status=${status}` : ''}`}>
                            <Button variant="outline" size="sm">{isHindi ? 'अगला' : 'Next'}</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
