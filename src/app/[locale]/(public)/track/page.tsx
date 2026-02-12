import { setRequestLocale } from 'next-intl/server';
import prisma from '@/lib/db';
import ApplicationTracker from '@/components/public/ApplicationTracker';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ cNumber?: string }>;
};

export default async function TrackPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { cNumber } = await searchParams;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    // Check if public tracking is enabled
    const setting = await prisma.siteSetting.findUnique({
        where: { key: 'enablePublicTracking' },
        select: { value: true }
    });

    const isTrackingEnabled = setting?.value === 'true';

    // If disabled, show unavailable message
    if (!isTrackingEnabled) {
        return (
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <CardContent className="space-y-6">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                            <Lock className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {isHindi ? 'यह सुविधा अभी उपलब्ध नहीं है' : 'This feature is currently unavailable'}
                            </h1>
                            <p className="text-muted-foreground">
                                {isHindi
                                    ? 'आवेदन स्थिति ट्रैक करने की सुविधा अस्थायी रूप से अक्षम है। कृपया बाद में पुनः प्रयास करें या कार्यालय से संपर्क करें।'
                                    : 'Application tracking is temporarily disabled. Please try again later or contact our office.'}
                            </p>
                        </div>
                        <Link href="/">
                            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                                <ArrowLeft className="h-4 w-4" />
                                {isHindi ? 'होम पेज पर जाएं' : 'Go to Home Page'}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        );
    }

    // If enabled, show the tracker
    return (
        <div className="flex flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white py-12 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {isHindi ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application Status'}
                        </h1>
                        <p className="text-lg opacity-90 max-w-2xl mx-auto">
                            {isHindi
                                ? 'अपना आवेदन नंबर (C-Number) दर्ज करके अपनी आवेदन की स्थिति देखें'
                                : 'Enter your application number (C-Number) to check your application status'}
                        </p>
                    </div>
                </section>

                {/* Tracker Section */}
                <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto max-w-2xl">
                        <ApplicationTracker locale={locale} initialCNumber={cNumber} />
                    </div>
                </section>
            </main>
        </div>
    );
}
