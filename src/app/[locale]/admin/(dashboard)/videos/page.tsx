import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video } from 'lucide-react';
import VideoManager from '@/components/admin/VideoManager';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function VideosPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'वीडियो प्रबंधन' : 'Video Management'}
                </h1>
                <p className="dashboard-body mt-1">
                    {isHindi ? 'वेबसाइट पर प्रदर्शित होने वाले वीडियो प्रबंधित करें' : 'Manage videos displayed on the website'}
                </p>
            </div>

            <Card className="dashboard-card border-0">
                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Video className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'सभी वीडियो' : 'All Videos'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'यूट्यूब/विमियो लिंक जोड़ें और प्रबंधित करें' : 'Add and manage YouTube/Vimeo links'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <VideoManager locale={locale} />
                </CardContent>
            </Card>
        </div>
    );
}
