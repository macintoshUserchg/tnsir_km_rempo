import { prisma } from '@/lib/db';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import AdminEventForm from '@/components/admin/AdminEventForm';
import { notFound } from 'next/navigation';

export default async function EditEventPage({
    params
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params;
    const isHindi = locale === 'hi';

    const eventId = parseInt(id);
    if (isNaN(eventId)) notFound();

    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) notFound();

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="-ml-2 h-10 w-10 text-muted-foreground hover:text-foreground" asChild>
                    <Link href="/admin/events">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="dashboard-title">{isHindi ? 'कार्यक्रम संपादित करें' : 'Edit Event'}</h1>
                    <p className="dashboard-body mt-1">
                        {isHindi ? 'मौजूदा कार्यक्रम के विवरण को अपडेट करें।' : 'Update details of the existing event.'}
                    </p>
                </div>
            </div>

            <AdminEventForm locale={locale} initialData={event} />
        </div>
    );
}
