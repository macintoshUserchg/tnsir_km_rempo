import { prisma } from '@/lib/db';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Eye, FileText, Calendar, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PageList({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const isHindi = locale === 'hi';

    const pages = await prisma.page.findMany({
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="dashboard-title">
                        {isHindi ? 'पेज प्रबंधन' : 'Pages Management'}
                    </h1>
                    <p className="dashboard-body text-muted-foreground mt-1">
                        {isHindi ? 'डायनामिक पेजों को बनाएं और प्रबंधित करें' : 'Create and manage dynamic content pages'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/20 rounded-xl hidden md:flex">
                        <FileText className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                            {isHindi ? `कुल पेज: ${pages.length}` : `Total Pages: ${pages.length}`}
                        </span>
                    </div>
                    <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20">
                        <Link href="/admin/pages/new">
                            <Plus className="mr-2 h-4 w-4" />
                            {isHindi ? 'नया पेज जोड़ें' : 'Create New Page'}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-orange-600 transition-colors" />
                    <Input
                        type="search"
                        placeholder={isHindi ? 'पेज खोजें...' : 'Search pages...'}
                        className="pl-10 bg-card border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-xl transition-all"
                    />
                </div>
                {/* Placeholder for future filters */}
                {/* <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 rounded-xl">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </Button>
                </div> */}
            </div>

            {/* Content Card */}
            <Card className="dashboard-card border-0">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="dashboard-section">
                                {isHindi ? 'सभी पेज' : 'All Pages'}
                            </CardTitle>
                            <CardDescription className="dashboard-label mt-1">
                                {isHindi ? 'आपकी वेबसाइट के डायनामिक पेजों की सूची' : 'List of all dynamic pages on your website'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/40">
                                    <TableHead className="py-4 pl-6 w-[250px] font-bold">
                                        {isHindi ? 'शीर्षक' : 'Title'}
                                    </TableHead>
                                    <TableHead className="font-bold">Slug</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold">Updated</TableHead>
                                    <TableHead className="text-right font-bold py-4 pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((page) => (
                                    <TableRow key={page.id} className="group hover:bg-muted/50 transition-colors border-border/40">
                                        <TableCell className="py-5 pl-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-base text-foreground">
                                                    {isHindi ? (page.titleHi || page.titleEn) : (page.titleEn || page.titleHi)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {isHindi ? page.titleEn : page.titleHi}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="dashboard-mono bg-muted/50 px-2.5 py-1 rounded-md text-xs border border-border/30 text-muted-foreground group-hover:text-foreground group-hover:border-orange-200 transition-colors">
                                                    /{page.slug}
                                                </code>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "dashboard-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]",
                                                page.isPublished
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                                                    : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                                            )}>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    page.isPublished ? "bg-emerald-500" : "bg-amber-500"
                                                )} />
                                                {page.isPublished
                                                    ? (isHindi ? 'प्रकाशित' : 'Published')
                                                    : (isHindi ? 'ड्राफ्ट' : 'Draft')
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5 opacity-70" />
                                                <span className="dashboard-mono text-xs">
                                                    {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right py-4 pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-colors" asChild title="Preview">
                                                    <Link href={`/${page.slug}`} target="_blank">
                                                        <Eye className="h-4.5 w-4.5" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-colors" asChild title="Edit">
                                                    <Link href={`/admin/pages/${page.id}`}>
                                                        <Edit className="h-4.5 w-4.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {pages.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
                                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <p className="dashboard-body font-bold text-lg mb-1">
                                                {isHindi ? 'कोई पेज नहीं मिला' : 'No pages found'}
                                            </p>
                                            <p className="dashboard-label">
                                                {isHindi ? 'नया पेज बनाने के लिए ऊपर दिए गए बटन का उपयोग करें' : 'Get started by creating a new page'}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
