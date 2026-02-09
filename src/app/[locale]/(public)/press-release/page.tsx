'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useLocale } from 'next-intl';
import { FileText, Clock } from 'lucide-react';

export default function PressReleasePage() {
    const locale = useLocale();
    const isHindi = locale === 'hi';

    return (
        <>
            <PageHero
                title={isHindi ? 'प्रेस विज्ञप्ति' : 'Press Releases'}
                subtitle={isHindi ? 'नवीनतम आधिकारिक बयान और घोषणाएं' : 'Latest official statements and announcements'}
            />

            <section className="py-12 md:py-16">
                <Container>
                    <AnimatedSection delay={0.1}>
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-12 text-center border border-orange-100">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-10 h-10 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {isHindi ? 'प्रेस विज्ञप्ति जल्द आ रही है' : 'Press Releases Coming Soon'}
                                </h2>
                                <p className="text-gray-600 text-lg mb-6">
                                    {isHindi
                                        ? 'आधिकारिक बयान और घोषणाएं यहाँ प्रदर्शित की जाएंगी।'
                                        : 'Official statements and announcements will be displayed here.'}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-orange-600">
                                    <Clock className="w-5 h-5" />
                                    <span className="font-medium">
                                        {isHindi ? 'जल्द उपलब्ध होगा' : 'Available Soon'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </Container>
            </section>
        </>
    );
}
