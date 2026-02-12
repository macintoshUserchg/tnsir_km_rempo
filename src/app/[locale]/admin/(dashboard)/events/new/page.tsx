import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import AdminEventForm from '@/components/admin/AdminEventForm';

export default async function NewEventPage({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const isHindi = locale === 'hi';

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="-ml-2 h-10 w-10 text-muted-foreground hover:text-foreground" asChild>
                    <Link href="/admin/events">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="dashboard-title">{isHindi ? 'नया कार्यक्रम जोड़ें' : 'Create New Event'}</h1>
                    <p className="dashboard-body mt-1">
                        {isHindi ? 'वेबसाइट पर प्रदर्शित करने के लिए एक नया कार्यक्रम बनाएं।' : 'Create a new event to display on the website.'}
                    </p>
                </div>
            </div>

            <AdminEventForm locale={locale} />
        </div>
    );
}
