import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { biographyData } from '@/data/biography';
import { setRequestLocale, getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function BiographyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('biography');

    return (
        <div className="section-padding">
            <Container>
                <SectionHeading
                    title={t('title')}
                    subtitle={t('subtitle')}
                    centered
                />

                <div className="max-w-4xl mx-auto">
                    {/* Profile Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 shadow-md ring-4 ring-orange-100">
                                <img
                                    src={biographyData.profileImage}
                                    alt={locale === 'hi' ? biographyData.fullNameHi || biographyData.fullName : biographyData.fullName}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {locale === 'hi' ? biographyData.fullNameHi || biographyData.fullName : biographyData.fullName}
                                </h2>
                                <p className="text-xl text-orange-600 mb-4">
                                    {locale === 'hi' ? biographyData.currentPositionHi || biographyData.currentPosition : biographyData.currentPosition}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                                    <div>
                                        <span className="font-semibold">{t('born')}:</span> {biographyData.dateOfBirth}
                                    </div>
                                    <div>
                                        <span className="font-semibold">{t('place')}:</span>{' '}
                                        {locale === 'hi' ? biographyData.placeOfBirthHi || biographyData.placeOfBirth : biographyData.placeOfBirth}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Early Life */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('earlyLife')}</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {locale === 'hi' ? biographyData.earlyLifeHi || biographyData.earlyLife : biographyData.earlyLife}
                        </p>
                    </div>

                    {/* Education */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('education')}</h3>
                        <ul className="space-y-3">
                            {(locale === 'hi' ? (biographyData.educationHi || biographyData.education) : biographyData.education).map((edu: string, index: number) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-1">🎓</span>
                                    <span className="text-lg text-gray-700">{edu}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Political Career */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('politicalCareer')}</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {locale === 'hi' ? biographyData.politicalCareerHi || biographyData.politicalCareer : biographyData.politicalCareer}
                        </p>
                    </div>

                    {/* Achievements */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('keyAchievements')}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(locale === 'hi' ? (biographyData.achievementsHi || biographyData.achievements) : biographyData.achievements).map((achievement: string, index: number) => (
                                <div key={index} className="bg-orange-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <span className="text-orange-500 text-xl">✓</span>
                                        <span className="text-gray-700">{achievement}</span>
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
