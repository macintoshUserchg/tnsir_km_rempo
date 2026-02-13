import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { setRequestLocale } from 'next-intl/server';
import { BookOpen, Clock } from 'lucide-react';
import prisma from '@/lib/db';
import { BlogCard } from '@/components/public/BlogCard';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    const blogs = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <>
            <PageHero
                title={isHindi ? 'ब्लॉग' : 'Blog'}
                subtitle={isHindi ? 'विचार, अपडेट और अंतर्दृष्टि' : 'Thoughts, updates, and insights'}
            />

            <section className="py-12 md:py-20 bg-gray-50/50 dark:bg-transparent">
                <Container>
                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, idx) => (
                                <BlogCard key={blog.id} blog={blog} locale={locale} />
                            ))}
                        </div>
                    ) : (
                        <AnimatedSection delay={0.1}>
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white dark:bg-zinc-900 shadow-xl shadow-orange-500/5 rounded-3xl p-16 text-center border border-orange-100 dark:border-orange-900/20">
                                    <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-zinc-800 shadow-lg shadow-orange-500/10">
                                        <BookOpen className="w-12 h-12 text-orange-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        {isHindi ? 'ब्लॉग पोस्ट जल्द आ रहे हैं' : 'Blog Posts Coming Soon'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                                        {isHindi
                                            ? 'हम यहाँ जल्द ही नए विचार और महत्वपूर्ण अपडेट साझा करेंगे। जुड़े रहें!'
                                            : 'We will be sharing new thoughts and important updates here very soon. Stay tuned!'}
                                    </p>
                                    <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full font-bold">
                                        <Clock className="w-5 h-5 animate-pulse" />
                                        <span>
                                            {isHindi ? 'जल्द उपलब्ध होगा' : 'Available Soon'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    )}
                </Container>
            </section>
        </>
    );
}
