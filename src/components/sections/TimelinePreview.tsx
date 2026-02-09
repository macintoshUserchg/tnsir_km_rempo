import React from 'react';
import { Link } from '@/i18n/navigation';
import { Calendar, ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { timelineData } from '@/data/timeline';

export const TimelinePreview: React.FC = () => {
    const recentEvents = timelineData.slice(-5).reverse();

    return (
        <section className="section-padding">
            <Container>
                <SectionHeading
                    title="Journey"
                    subtitle="Milestones in a life dedicated to public service"
                    centered
                />

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-orange-200"></div>

                        {/* Timeline Events */}
                        <div className="space-y-12">
                            {recentEvents.map((event, index) => (
                                <div
                                    key={event.id}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2"></div>

                                    {/* Content */}
                                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 pl-16' : 'md:pl-12 pl-16'}`}>
                                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                            <div className="flex items-center gap-2 text-orange-600 font-semibold mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{event.year}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600">{event.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/journey">
                            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                                View Complete Journey
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};
