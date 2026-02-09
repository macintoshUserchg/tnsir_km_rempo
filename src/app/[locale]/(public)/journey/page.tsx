import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { timelineData } from '@/data/timeline';
import { Calendar } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function JourneyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="section-padding">
            <Container>
                <SectionHeading
                    title="Journey"
                    subtitle="A timeline of dedication and service"
                    centered
                />

                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-300"></div>

                        {/* Timeline Events */}
                        <div className="space-y-16">
                            {timelineData.map((event, index) => (
                                <div
                                    key={event.id}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 z-10"></div>

                                    {/* Content */}
                                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 pl-20' : 'md:pl-16 pl-20'}`}>
                                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="flex items-center gap-2 text-orange-600 font-bold mb-3">
                                                <Calendar className="w-5 h-5" />
                                                <span className="text-2xl">{event.year}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                                            <div className="mt-3">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${event.category === 'political' ? 'bg-orange-100 text-orange-700' :
                                                    event.category === 'education' ? 'bg-blue-100 text-blue-700' :
                                                        event.category === 'achievement' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
