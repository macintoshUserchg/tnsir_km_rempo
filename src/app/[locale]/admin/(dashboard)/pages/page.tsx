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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default async function PageList({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const pages = await prisma.page.findMany({
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="dashboard-title">Pages</h1>
                    <p className="dashboard-body mt-1">
                        Manage dynamic pages and their content sections.
                    </p>
                </div>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20">
                    <Link href="/admin/pages/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Page
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-orange-600 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search pages..."
                        className="pl-10 bg-card border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-lg transition-all"
                    />
                </div>
            </div>

            <div className="dashboard-card border border-border/40">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead className="font-bold py-4">Title (Hi)</TableHead>
                            <TableHead className="font-bold">Title (En)</TableHead>
                            <TableHead className="font-bold">Slug</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">Updated</TableHead>
                            <TableHead className="text-right font-bold py-4 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages.map((page) => (
                            <TableRow key={page.id} className="group hover:bg-muted/20 transition-colors border-border/40">
                                <TableCell className="font-bold dashboard-body text-foreground py-4">{page.titleHi}</TableCell>
                                <TableCell className="dashboard-body">{page.titleEn || '-'}</TableCell>
                                <TableCell>
                                    <code className="dashboard-mono bg-muted/50 px-2 py-0.5 rounded text-sm border border-border/30">
                                        /{page.slug}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "dashboard-badge inline-flex",
                                        page.isPublished
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-500 dark:border-emerald-800"
                                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800"
                                    )}>
                                        {page.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </TableCell>
                                <TableCell className="dashboard-label">
                                    {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell className="text-right py-4 pr-6">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20" asChild title="Preview">
                                            <Link href={`/${page.slug}`} target="_blank">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20" asChild title="Edit">
                                            <Link href={`/admin/pages/${page.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {pages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No pages found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
