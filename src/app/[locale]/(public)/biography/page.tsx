'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { biographyData } from '@/data/biography';
import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, GraduationCap, Building2, Trophy, Quote } from 'lucide-react';

export default function BiographyPage() {
    const t = useTranslations('biography');
    const locale = useLocale();
    const isHindi = locale === 'hi';

    const fullName = (isHindi && biographyData.fullNameHi) || biographyData.fullName;
    const currentPosition = (isHindi && biographyData.currentPositionHi) || biographyData.currentPosition;
    const placeOfBirth = (isHindi && biographyData.placeOfBirthHi) || biographyData.placeOfBirth;
    const earlyLife = (isHindi && biographyData.earlyLifeHi) || biographyData.earlyLife;
    const education = (isHindi ? biographyData.educationHi : biographyData.education) || [];
    const politicalCareer = (isHindi && biographyData.politicalCareerHi) || biographyData.politicalCareer;
    const achievements = (isHindi ? biographyData.achievementsHi : biographyData.achievements) || [];

    return (
        <div className="bg-white">
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-16 md:py-24 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-50 rounded-bl-full opacity-50 -z-10" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-50 rounded-tr-full opacity-50 -z-10" />

                <Container>
                    <div className="max-w-5xl mx-auto">
                        {/* Profile Header Card */}
                        <AnimatedSection delay={0.1}>
                            <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100/50 p-6 md:p-10 mb-16 border border-orange-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

                                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                                    <div className="relative group">
                                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl ring-8 ring-orange-50 transition-transform duration-500 group-hover:scale-[1.02]">
                                            <img
                                                src={biographyData.profileImage}
                                                alt={fullName || "Dr. Kirodi Lal Meena"}
                                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 bg-orange-600 text-white p-3 rounded-xl shadow-xl">
                                            <Quote className="w-6 h-6 fill-white/20" />
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4 tracking-wide uppercase">
                                            {isHindi ? 'व्यक्तित्व परिचय' : 'Profile Overview'}
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                                            {fullName}
                                        </h2>
                                        <p className="text-xl md:text-2xl text-orange-600 font-bold mb-8 leading-relaxed">
                                            {currentPosition}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-orange-50">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 font-bold">
                                                    🎂
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('born')}</p>
                                                    <p className="text-gray-900 font-bold">{biographyData.dateOfBirth}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-orange-50">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600">
                                                    📍
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('place')}</p>
                                                    <p className="text-gray-900 font-bold">{placeOfBirth}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Side - Biography Details */}
                            <div className="lg:col-span-2 space-y-16">
                                {/* Early Life */}
                                <AnimatedSection delay={0.2}>
                                    <div className="relative group">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center text-white transform transition-transform group-hover:rotate-12">
                                                <BookOpen className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                                {t('earlyLife')}
                                            </h3>
                                        </div>
                                        <div className="prose prose-lg prose-orange max-w-none">
                                            <p className="text-gray-700 leading-[1.8] text-lg font-medium">
                                                {earlyLife}
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedSection>

                                {/* Education */}
                                <AnimatedSection delay={0.3}>
                                    <div className="relative group">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center text-white transform transition-transform group-hover:rotate-12">
                                                <GraduationCap className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                                {t('education')}
                                            </h3>
                                        </div>
                                        <div className="grid gap-4">
                                            {education.map((edu: string, index: number) => (
                                                <div key={index} className="flex items-center gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 transition-all hover:bg-blue-50 group/item">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full group-hover/item:scale-125 transition-transform" />
                                                    <span className="text-xl font-bold text-gray-800">{edu}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>

                                {/* Political Career */}
                                <AnimatedSection delay={0.4}>
                                    <div className="relative group">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-center text-white transform transition-transform group-hover:rotate-12">
                                                <Building2 className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                                {t('politicalCareer')}
                                            </h3>
                                        </div>
                                        <div className="bg-purple-50/30 rounded-3xl p-8 border border-purple-100">
                                            <p className="text-gray-700 leading-[1.8] text-lg font-medium">
                                                {politicalCareer}
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>

                            {/* Right Side - Key Achievements Sticky */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <AnimatedSection delay={0.5}>
                                        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-3xl text-white relative overflow-hidden">
                                            {/* Decorative element */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl" />
                                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl" />

                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                                    <Trophy className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-black">
                                                    {t('keyAchievements')}
                                                </h3>
                                            </div>

                                            <StaggerContainer className="space-y-6">
                                                {achievements.map((achievement: string, index: number) => (
                                                    <StaggerItem key={index}>
                                                        <div className="flex gap-4 group/item">
                                                            <div className="mt-1.5 flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center transition-colors group-hover/item:bg-orange-500">
                                                                <div className="w-2 h-2 bg-orange-500 rounded-full transition-colors group-hover/item:bg-white" />
                                                            </div>
                                                            <p className="text-gray-300 group-hover/item:text-white transition-colors leading-relaxed font-semibold">
                                                                {achievement}
                                                            </p>
                                                        </div>
                                                    </StaggerItem>
                                                ))}
                                            </StaggerContainer>

                                            <div className="mt-12 pt-8 border-t border-white/10 text-center">
                                                <div className="text-orange-500 font-black text-4xl mb-2">40+</div>
                                                <div className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                                    {isHindi ? 'वर्षों का सार्वजनिक सेवा' : 'Years of Public Service'}
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
