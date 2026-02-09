'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { biographyData } from '@/data/biography';
import { useTranslations, useLocale } from 'next-intl';

export default function BiographyPage() {
    const t = useTranslations('biography');
    const locale = useLocale();
    const isHindi = locale === 'hi';

    return (
        <>
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-12 md:py-16">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {/* Profile Section */}
                        <AnimatedSection delay={0.1}>
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-orange-100">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 shadow-xl ring-4 ring-orange-100">
                                        <img
                                            src={biographyData.profileImage}
                                            alt={isHindi ? biographyData.fullNameHi || biographyData.fullName : biographyData.fullName}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                            {isHindi ? biographyData.fullNameHi || biographyData.fullName : biographyData.fullName}
                                        </h2>
                                        <p className="text-xl text-orange-600 font-medium mb-4">
                                            {isHindi ? biographyData.currentPositionHi || biographyData.currentPosition : biographyData.currentPosition}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                                            <div className="bg-orange-50 rounded-lg p-3">
                                                <span className="font-semibold text-orange-700">{t('born')}:</span>{' '}
                                                <span>{biographyData.dateOfBirth}</span>
                                            </div>
                                            <div className="bg-orange-50 rounded-lg p-3">
                                                <span className="font-semibold text-orange-700">{t('place')}:</span>{' '}
                                                <span>{isHindi ? biographyData.placeOfBirthHi || biographyData.placeOfBirth : biographyData.placeOfBirth}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Early Life */}
                        <AnimatedSection delay={0.2}>
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 text-lg">📖</span>
                                    </span>
                                    {t('earlyLife')}
                                </h3>
                                <p className="text-lg text-gray-700 leading-relaxed pl-13">
                                    {isHindi ? biographyData.earlyLifeHi || biographyData.earlyLife : biographyData.earlyLife}
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Education */}
                        <AnimatedSection delay={0.3}>
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 text-lg">🎓</span>
                                    </span>
                                    {t('education')}
                                </h3>
                                <StaggerContainer className="space-y-3 pl-13">
                                    {(isHindi ? (biographyData.educationHi || biographyData.education) : biographyData.education).map((edu: string, index: number) => (
                                        <StaggerItem key={index}>
                                            <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                                <span className="text-orange-500 text-xl mt-0.5">✓</span>
                                                <span className="text-lg text-gray-700">{edu}</span>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </AnimatedSection>

                        {/* Political Career */}
                        <AnimatedSection delay={0.4}>
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 text-lg">🏛️</span>
                                    </span>
                                    {t('politicalCareer')}
                                </h3>
                                <p className="text-lg text-gray-700 leading-relaxed pl-13">
                                    {isHindi ? biographyData.politicalCareerHi || biographyData.politicalCareer : biographyData.politicalCareer}
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Achievements */}
                        <AnimatedSection delay={0.5}>
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 text-lg">🏆</span>
                                    </span>
                                    {t('keyAchievements')}
                                </h3>
                                <StaggerContainer className="grid md:grid-cols-2 gap-4">
                                    {(isHindi ? (biographyData.achievementsHi || biographyData.achievements) : biographyData.achievements).map((achievement: string, index: number) => (
                                        <StaggerItem key={index}>
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-orange-500 text-xl font-bold">✓</span>
                                                    <span className="text-gray-800 font-medium">{achievement}</span>
                                                </div>
                                            </div>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </div>
                        </AnimatedSection>
                    </div>
                </Container>
            </section>
        </>
    );
}
