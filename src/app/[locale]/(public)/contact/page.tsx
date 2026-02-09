import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {isHindi ? 'संपर्क करें' : 'Contact Us'}
                        </h1>
                        <p className="text-xl opacity-90">
                            {isHindi
                                ? 'हमसे जुड़ें और अपनी समस्याएं साझा करें'
                                : 'Connect with us and share your concerns'}
                        </p>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-orange-600 mb-6">
                                    {isHindi ? 'संपर्क जानकारी' : 'Contact Information'}
                                </h2>

                                <Card>
                                    <CardContent className="p-6 flex gap-4">
                                        <MapPin className="h-6 w-6 text-orange-500 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {isHindi ? 'कार्यालय का पता' : 'Office Address'}
                                            </h3>
                                            <p className="text-gray-600">
                                                {isHindi
                                                    ? 'विधायक निवास, सवाई माधोपुर, राजस्थान - 322001'
                                                    : 'MLA Residence, Sawai Madhopur, Rajasthan - 322001'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6 flex gap-4">
                                        <Phone className="h-6 w-6 text-orange-500 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {isHindi ? 'फोन नंबर' : 'Phone Number'}
                                            </h3>
                                            <p className="text-gray-600">+91 XXXXX XXXXX</p>
                                            <p className="text-gray-600">+91 XXXXX XXXXX</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6 flex gap-4">
                                        <Mail className="h-6 w-6 text-orange-500 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {isHindi ? 'ईमेल' : 'Email'}
                                            </h3>
                                            <p className="text-gray-600">contact@drkirodilal.in</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6 flex gap-4">
                                        <Clock className="h-6 w-6 text-orange-500 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {isHindi ? 'कार्यालय समय' : 'Office Hours'}
                                            </h3>
                                            <p className="text-gray-600">
                                                {isHindi
                                                    ? 'सोमवार - शनिवार: सुबह 10:00 - शाम 5:00'
                                                    : 'Monday - Saturday: 10:00 AM - 5:00 PM'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Form */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-orange-600">
                                            {isHindi ? 'संदेश भेजें' : 'Send Message'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{isHindi ? 'नाम' : 'Name'}</Label>
                                                <Input id="name" placeholder={isHindi ? 'आपका नाम' : 'Your name'} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="mobile">{isHindi ? 'मोबाइल' : 'Mobile'}</Label>
                                                <Input id="mobile" placeholder="+91 XXXXX XXXXX" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{isHindi ? 'ईमेल' : 'Email'}</Label>
                                            <Input id="email" type="email" placeholder={isHindi ? 'आपका ईमेल' : 'Your email'} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">{isHindi ? 'विषय' : 'Subject'}</Label>
                                            <Input id="subject" placeholder={isHindi ? 'संदेश का विषय' : 'Message subject'} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">{isHindi ? 'संदेश' : 'Message'}</Label>
                                            <Textarea
                                                id="message"
                                                placeholder={isHindi ? 'अपना संदेश लिखें...' : 'Write your message...'}
                                                rows={5}
                                            />
                                        </div>
                                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                            {isHindi ? 'संदेश भेजें' : 'Send Message'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section Placeholder */}
                <section className="py-8 px-4 bg-gray-100">
                    <div className="container mx-auto max-w-6xl">
                        <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">
                                {isHindi ? 'मानचित्र यहाँ आएगा' : 'Map will be displayed here'}
                            </span>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
