import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquareQuote } from 'lucide-react';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function TestimonialsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'प्रशंसापत्र प्रबंधन' : 'Testimonials Manager'}
                </h1>
                <p className="dashboard-body mt-1">
                    {isHindi ? 'लोगों के विचार और अनुभव साझा करें' : 'Manage what people say about you'}
                </p>
            </div>

            <Card className="dashboard-card border-0">
                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <MessageSquareQuote className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'सभी प्रशंसापत्र' : 'All Testimonials'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'सूची देखें और प्रबंधित करें' : 'View and manage list'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <TestimonialsManager locale={locale} />
                </CardContent>
            </Card>
        </div>
    );
}
