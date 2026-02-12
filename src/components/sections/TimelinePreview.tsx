import React from 'react';
import { Link } from '@/i18n/navigation';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import prisma from '@/lib/db';

interface TimelinePreviewProps {
    locale: string;
}

export const TimelinePreview = async ({ locale }: TimelinePreviewProps) => {
    const isHindi = locale === 'hi';

    // Fetch recent events from DB associated with Prisma
    const recentEvents = await prisma.timelineEvent.findMany({
        orderBy: {
            year: 'asc',
        },
        take: 6,
    });

    return (
        <section className="section-padding bg-gray-50">
            <Container>
                <SectionHeading
                    title={isHindi ? "जीवन यात्रा" : "Journey"}
                    subtitle={isHindi ? "जन सेवा को समर्पित जीवन के मील के पत्थर" : "Milestones in a life dedicated to public service"}
                    centered
                />

                {/* Full Width Card Container */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden border border-gray-100">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-lg">{isHindi ? "हालिया मील के पत्थर" : "Recent Milestones"}</h3>
                                <p className="text-gray-500 text-xs md:text-sm hidden sm:block">{isHindi ? "यात्रा के प्रमुख क्षण" : "Key moments from the journey"}</p>
                            </div>
                        </div>
                        <Link
                            href="/journey"
                            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors text-xs md:text-sm shadow-md"
                        >
                            {isHindi ? "सभी देखें" : "View All"}
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                    </div>

                    {/* Scrollable Timeline Grid */}
                    <div className="max-h-[280px] md:max-h-[350px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-3 md:p-6">
                            {recentEvents.map((event, index) => (
                                <div
                                    key={event.id}
                                    className="group bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 p-3 md:p-5 rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-md"
                                >
                                    {/* Year Badge */}
                                    <div className="inline-flex items-center gap-1 md:gap-1.5 bg-orange-100 text-orange-600 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold mb-2 md:mb-3">
                                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        {event.year}
                                    </div>

                                    {/* Title */}
                                    <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                                        {isHindi && event.titleHi ? event.titleHi : event.titleEn}
                                    </h4>

                                    {/* Description */}
                                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{isHindi && event.descHi ? event.descHi : event.descEn}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
