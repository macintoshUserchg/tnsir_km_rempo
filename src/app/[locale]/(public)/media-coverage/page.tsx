import React from 'react';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function MediaCoveragePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="section-padding">
            <Container>
                <SectionHeading
                    title="Media Coverage"
                    subtitle="News and media appearances"
                    centered
                />
                <div className="max-w-4xl mx-auto text-center py-12">
                    <p className="text-gray-600 text-lg">
                        Media coverage will be displayed here. Content coming soon.
                    </p>
                </div>
            </Container>
        </div>
    );
};
