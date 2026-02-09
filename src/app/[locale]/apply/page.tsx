import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Phone, Clock, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function ApplyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {isHindi ? 'आवेदन कैसे करें?' : 'How to Apply?'}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {isHindi
                                ? 'अपनी शिकायत या अनुरोध दर्ज कराने के लिए कृपया नीचे दिए गए कार्यालय में संपर्क करें।'
                                : 'To register your complaint or request, please visit our office at the address given below.'}
                        </p>
                    </div>

                    {/* Office Info Card */}
                    <Card className="max-w-2xl mx-auto shadow-lg">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                                    <Building2 className="h-8 w-8 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isHindi ? 'कार्यालय का पता' : 'Office Address'}
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {isHindi ? 'डॉ. किरोड़ी लाल मीणा कार्यालय' : 'Dr. Kirodi Lal Meena Office'}
                                        </p>
                                        <p className="text-gray-600">
                                            {isHindi
                                                ? 'संसद भवन, नई दिल्ली - 110001'
                                                : 'Parliament House, New Delhi - 110001'}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {isHindi ? 'संपर्क नंबर' : 'Contact Number'}
                                        </p>
                                        <p className="text-gray-600">
                                            011-23034000
                                        </p>
                                    </div>
                                </div>

                                {/* Timings */}
                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {isHindi ? 'कार्यालय समय' : 'Office Hours'}
                                        </p>
                                        <p className="text-gray-600">
                                            {isHindi
                                                ? 'सोमवार - शुक्रवार: सुबह 10:00 - शाम 5:00'
                                                : 'Monday - Friday: 10:00 AM - 5:00 PM'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-8 pt-6 border-t text-center">
                                <p className="text-gray-600 mb-4">
                                    {isHindi
                                        ? 'आवश्यक दस्तावेजों के साथ कार्यालय में आएं'
                                        : 'Visit the office with required documents'}
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    {isHindi ? 'संपर्क पृष्ठ देखें' : 'View Contact Page'}
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Required Documents */}
                    <div className="max-w-2xl mx-auto mt-8">
                        <h3 className="text-xl font-semibold text-center mb-4">
                            {isHindi ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
                        </h3>
                        <ul className="bg-white rounded-lg shadow p-6 space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                {isHindi ? 'आधार कार्ड की प्रति' : 'Copy of Aadhaar Card'}
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                {isHindi ? 'निवास प्रमाण पत्र' : 'Residence Proof'}
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                {isHindi ? 'समस्या से संबंधित दस्तावेज़' : 'Documents related to the issue'}
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                {isHindi ? 'पासपोर्ट साइज फोटो' : 'Passport size photograph'}
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
