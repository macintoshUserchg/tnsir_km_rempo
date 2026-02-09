import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function BiographyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch timeline events from database
    const timelineEvents = await prisma.timelineEvent.findMany({
        orderBy: { year: 'asc' },
    });

    const isHindi = locale === 'hi';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {isHindi ? 'डॉ. किरोड़ी लाल मीणा' : 'Dr. Kirodi Lal Meena'}
                        </h1>
                        <p className="text-xl opacity-90">
                            {isHindi
                                ? 'राजस्थान सरकार में कैबिनेट मंत्री, कृषि, बागवानी एवं ग्रामीण विकास'
                                : 'Cabinet Minister, Agriculture, Horticulture & Rural Development, Government of Rajasthan'}
                        </p>
                    </div>
                </section>

                {/* Bio Content */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Photo Side */}
                            <div className="md:col-span-1">
                                <div className="bg-gray-200 rounded-lg aspect-[3/4] flex items-center justify-center mb-4">
                                    <span className="text-gray-500">
                                        {isHindi ? 'फोटो' : 'Photo'}
                                    </span>
                                </div>
                                <Card>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{isHindi ? 'जन्म' : 'Born'}</span>
                                            <span className="font-medium">3 {isHindi ? 'नवंबर' : 'November'} 1951</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{isHindi ? 'जन्मस्थान' : 'Birthplace'}</span>
                                            <span className="font-medium">{isHindi ? 'दौसा, राजस्थान' : 'Dausa, Rajasthan'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{isHindi ? 'शिक्षा' : 'Education'}</span>
                                            <span className="font-medium">MBBS</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{isHindi ? 'पार्टी' : 'Party'}</span>
                                            <span className="font-medium">{isHindi ? 'भाजपा' : 'BJP'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Content Side */}
                            <div className="md:col-span-2 space-y-8">
                                {/* Early Life */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-orange-600">
                                        {isHindi ? 'प्रारंभिक जीवन' : 'Early Life'}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {isHindi
                                            ? 'डॉ. किरोड़ी लाल मीणा का जन्म 3 नवंबर 1951 को राजस्थान के दौसा जिले में एक किसान परिवार में हुआ था। उन्होंने 1977 में बीकानेर के एस.पी. मेडिकल कॉलेज से एमबीबीएस की डिग्री प्राप्त की। दो वर्षों तक चिकित्सा पद्धति के बाद, वे राष्ट्रीय स्वयंसेवक संघ (RSS) से जुड़े और राजनीति में प्रवेश किया।'
                                            : 'Dr. Kirodi Lal Meena was born on November 3, 1951, in a farmer family in Dausa district, Rajasthan. He earned his MBBS degree from S.P. Medical College, Bikaner, in 1977. After practicing medicine for two years, he joined the Rashtriya Swayamsevak Sangh (RSS) and entered politics.'}
                                    </p>
                                </div>

                                {/* Political Career */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-orange-600">
                                        {isHindi ? 'राजनीतिक करियर' : 'Political Career'}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {isHindi
                                            ? 'डॉ. मीणा ने 1980 में पूर्व राजस्थान मुख्यमंत्री भैरों सिंह शेखावत के प्रोत्साहन पर अपना पहला विधानसभा चुनाव लड़ा। तब से वे छह बार विधायक और दो बार लोकसभा सांसद रह चुके हैं।'
                                            : 'Dr. Meena contested his first assembly election in 1980, encouraged by former Rajasthan Chief Minister Bhairon Singh Shekhawat. Since then, he has served as MLA six times and Member of Parliament twice.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="bg-orange-50 border-orange-200">
                                            <CardContent className="p-4 text-center">
                                                <div className="text-3xl font-bold text-orange-600">6</div>
                                                <div className="text-sm text-gray-600">{isHindi ? 'बार विधायक' : 'Times MLA'}</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-orange-50 border-orange-200">
                                            <CardContent className="p-4 text-center">
                                                <div className="text-3xl font-bold text-orange-600">2</div>
                                                <div className="text-sm text-gray-600">{isHindi ? 'बार सांसद' : 'Times MP'}</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Current Role */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-orange-600">
                                        {isHindi ? 'वर्तमान पद' : 'Current Position'}
                                    </h2>
                                    <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                                        <CardContent className="p-6">
                                            <Badge variant="secondary" className="mb-2">
                                                {isHindi ? 'वर्तमान' : 'Current'}
                                            </Badge>
                                            <h3 className="text-xl font-bold mb-2">
                                                {isHindi
                                                    ? 'कैबिनेट मंत्री - कृषि, बागवानी एवं ग्रामीण विकास'
                                                    : 'Cabinet Minister - Agriculture, Horticulture & Rural Development'}
                                            </h3>
                                            <p className="opacity-90">
                                                {isHindi
                                                    ? 'राजस्थान सरकार, भजन लाल शर्मा मंत्रिमंडल'
                                                    : 'Government of Rajasthan, Bhajan Lal Sharma Ministry'}
                                            </p>
                                            <p className="text-sm opacity-75 mt-2">
                                                {isHindi ? '30 दिसंबर 2023 से' : 'Since December 30, 2023'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Constituencies Represented */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-orange-600">
                                        {isHindi ? 'प्रतिनिधित्व किए गए क्षेत्र' : 'Constituencies Represented'}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mahuwa (1985)', 'Bamanwas (1998)', 'Sawai Madhopur (2003, Current)', 'Todabhim (2008)', 'Lalsot (2013)'].map((area) => (
                                            <Badge key={area} variant="outline" className="text-orange-600 border-orange-300">
                                                {area}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline Section */}
                <section className="py-16 px-4 bg-gray-50">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="text-3xl font-bold text-center mb-12 text-orange-600">
                            {isHindi ? 'समयरेखा' : 'Timeline'}
                        </h2>
                        <div className="space-y-8">
                            {timelineEvents.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                            {event.year}
                                        </div>
                                        {index < timelineEvents.length - 1 && (
                                            <div className="w-0.5 h-full bg-orange-300 mt-2" />
                                        )}
                                    </div>
                                    <Card className="flex-1">
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-lg">
                                                {isHindi ? event.titleHi : (event.titleEn || event.titleHi)}
                                            </h3>
                                            <p className="text-gray-600">
                                                {isHindi ? event.descHi : (event.descEn || event.descHi)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
