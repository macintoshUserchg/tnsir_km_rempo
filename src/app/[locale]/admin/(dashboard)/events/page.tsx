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
import { Plus, Search, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function AdminEventsPage({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'admin' });

    // Fetch events sorted by date (newest first)
    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' }
    });

    const isHindi = locale === 'hi';

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="dashboard-title">{isHindi ? 'कार्यक्रम' : 'Events'}</h1>
                    <p className="dashboard-body mt-1">
                        {isHindi ? 'सभी सार्वजनिक कार्यक्रमों और आयोजनों का प्रबंधन करें।' : 'Manage all public events and gatherings.'}
                    </p>
                </div>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20">
                    <Link href="/admin/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {isHindi ? 'नया कार्यक्रम जोड़ें' : 'Add New Event'}
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-orange-600 transition-colors" />
                    <Input
                        type="search"
                        placeholder={isHindi ? 'कार्यक्रम खोजें...' : 'Search events...'}
                        className="pl-10 bg-card border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-lg transition-all"
                    />
                </div>
            </div>

            <div className="dashboard-card border border-border/40">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead className="font-bold py-4 pl-6 w-[300px]">{isHindi ? 'शीर्षक' : 'Title'}</TableHead>
                            <TableHead className="font-bold">{isHindi ? 'दिनांक और समय' : 'Date & Time'}</TableHead>
                            <TableHead className="font-bold">{isHindi ? 'स्थान' : 'Location'}</TableHead>
                            <TableHead className="font-bold">{isHindi ? 'स्थिती' : 'Status'}</TableHead>
                            <TableHead className="font-bold">{isHindi ? 'श्रेणी' : 'Category'}</TableHead>
                            <TableHead className="text-right font-bold py-4 pr-6">{isHindi ? 'कार्रवाई' : 'Actions'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id} className="group hover:bg-muted/20 transition-colors border-border/40">
                                <TableCell className="py-4 pl-6">
                                    <div className="font-bold dashboard-body text-foreground line-clamp-1">{isHindi ? event.titleHi : (event.titleEn || event.titleHi)}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{isHindi ? event.titleEn : event.titleHi}</div>
                                </TableCell>
                                <TableCell className="dashboard-label">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                        <span>{format(new Date(event.date), 'MMM d, yyyy • h:mm a')}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="dashboard-label">
                                    {event.locationHi || event.locationEn ? (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                                            <span className="truncate max-w-[150px]">{isHindi ? event.locationHi : (event.locationEn || event.locationHi)}</span>
                                        </div>
                                    ) : '-'}
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "dashboard-badge inline-flex",
                                        event.isUpcoming
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-500 dark:border-emerald-800"
                                            : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                    )}>
                                        {event.isUpcoming
                                            ? (isHindi ? 'आगामी' : 'Upcoming')
                                            : (isHindi ? 'संपन्न' : 'Past')}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs border border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/10 font-medium">
                                        {event.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right py-4 pr-6">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20" asChild title="Edit">
                                            <Link href={`/admin/events/${event.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {/* TODO: Add Delete functionality */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {events.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground bg-muted/5">
                                    <div className="flex flex-col items-center gap-2">
                                        <Calendar className="w-8 h-8 text-muted-foreground/50" />
                                        <p>{isHindi ? 'कोई कार्यक्रम नहीं मिला।' : 'No events found.'}</p>
                                        <Button variant="outline" size="sm" asChild className="mt-2 text-xs">
                                            <Link href="/admin/events/new">
                                                {isHindi ? 'अभी बनाएं' : 'Create Now'}
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
