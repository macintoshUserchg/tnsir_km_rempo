import React from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { biographyData } from '@/data/biography';

export const BiographyPreview: React.FC = () => {
    return (
        <section className="section-padding bg-gray-50">
            <Container>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl overflow-hidden">
                            <img
                                src={biographyData.profileImage}
                                alt="Dr. Kirodi Lal Meena"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>

                    {/* Content */}
                    <div>
                        <SectionHeading
                            title="Biography"
                            subtitle="Learn about the journey and achievements"
                        />
                        <div className="space-y-4 text-gray-700">
                            <p className="text-lg leading-relaxed">
                                {biographyData.earlyLife.substring(0, 200)}...
                            </p>
                            <p className="text-lg leading-relaxed">
                                {biographyData.politicalCareer.substring(0, 200)}...
                            </p>
                        </div>
                        <div className="mt-6">
                            <h4 className="font-bold text-xl mb-3">Key Highlights:</h4>
                            <ul className="space-y-2">
                                {biographyData.achievements.slice(0, 3).map((achievement, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">✓</span>
                                        <span className="text-gray-700">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href="/biography" className="inline-block mt-8">
                            <Button icon={<ArrowRight className="w-5 h-5" />}>
                                Read Full Biography
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};
