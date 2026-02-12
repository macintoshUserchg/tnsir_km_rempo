'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';
import { biographyData } from '@/data/biography';

export const BiographyPreview: React.FC = () => {
    const locale = useLocale();
    const isHindi = locale === 'hi';

    return (
        <section className="section-padding bg-gray-50">
            <Container>
                <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Image */}
                    <div className="relative order-first lg:order-none">
                        <div className="aspect-square max-w-[280px] sm:max-w-xs md:max-w-none mx-auto lg:mx-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl md:rounded-2xl overflow-hidden">
                            <img
                                src={biographyData.profileImage}
                                alt={isHindi && biographyData.fullNameHi ? biographyData.fullNameHi : "Dr. Kirodi Lal Meena"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 md:w-32 md:h-32 bg-orange-500 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-20 h-20 md:w-32 md:h-32 bg-yellow-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>

                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <SectionHeading
                            title={isHindi ? "जीवनी" : "Biography"}
                            subtitle={isHindi ? "जीवन यात्रा और उपलब्धियों के बारे में जानें" : "Learn about the journey and achievements"}
                        />
                        <div className="space-y-3 md:space-y-4 text-gray-700">
                            <p className="text-sm md:text-lg leading-relaxed">
                                {(isHindi && biographyData.earlyLifeHi ? biographyData.earlyLifeHi : biographyData.earlyLife).substring(0, 150)}...
                            </p>
                            <p className="text-sm md:text-lg leading-relaxed hidden sm:block">
                                {(isHindi && biographyData.politicalCareerHi ? biographyData.politicalCareerHi : biographyData.politicalCareer).substring(0, 150)}...
                            </p>
                        </div>
                        <div className="mt-4 md:mt-6">
                            <h4 className="font-bold text-lg md:text-xl mb-2 md:mb-3">{isHindi ? "प्रमुख झलकियाँ:" : "Key Highlights:"}</h4>
                            <ul className="space-y-1.5 md:space-y-2 text-left">
                                {(isHindi && biographyData.achievementsHi ? biographyData.achievementsHi : biographyData.achievements).slice(0, 3).map((achievement, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm md:text-base">
                                        <span className="text-orange-500 mt-0.5">✓</span>
                                        <span className="text-gray-700 line-clamp-1 md:line-clamp-none">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href="/biography" className="inline-block mt-6 md:mt-8">
                            <Button
                                icon={<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                                className="text-sm md:text-base"
                            >
                                {isHindi ? "पूरी जीवनी पढ़ें" : "Read Full Biography"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
};
