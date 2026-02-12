import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import InboxManager from '@/components/admin/InboxManager';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function InboxPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'इनबॉक्स' : 'Inbox'}
                </h1>
                <p className="dashboard-body mt-1">
                    {isHindi ? 'संपर्क प्रश्नों को देखें और प्रबंधित करें' : 'View and manage contact queries'}
                </p>
            </div>

            <Card className="dashboard-card border-0">
                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'संपर्क प्रश्न' : 'Contact Queries'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'वेबसाइट से प्राप्त संदेश' : 'Messages received from website'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <InboxManager locale={locale} />
                </CardContent>
            </Card>
        </div>
    );
}
