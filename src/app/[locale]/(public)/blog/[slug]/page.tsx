import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import prisma from '@/lib/db';
import { Link } from '@/i18n/navigation';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';

    const blogPost = await prisma.blogPost.findUnique({
        where: { slug, published: true },
    });

    if (!blogPost) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Breadcrumb */}
                <section className="bg-gray-100 py-4 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <Link href="/blog" className="flex items-center gap-2 text-orange-600 hover:underline">
                            <ArrowLeft className="h-4 w-4" />
                            {isHindi ? 'सभी ब्लॉग' : 'All Blogs'}
                        </Link>
                    </div>
                </section>

                {/* Blog Content */}
                <article className="py-12 px-4">
                    <div className="container mx-auto max-w-4xl">
                        {/* Featured Image */}
                        {blogPost.imageUrl && (
                            <div className="aspect-video rounded-lg overflow-hidden mb-8">
                                <img
                                    src={blogPost.imageUrl}
                                    alt={isHindi ? blogPost.titleHi : (blogPost.titleEn || blogPost.titleHi)}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Header */}
                        <header className="mb-8">
                            <Badge className="bg-orange-100 text-orange-700 mb-4">
                                {isHindi ? 'ब्लॉग' : 'Blog'}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {isHindi ? blogPost.titleHi : (blogPost.titleEn || blogPost.titleHi)}
                            </h1>

                            <div className="flex items-center gap-6 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{blogPost.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {blogPost.publishedAt && new Date(blogPost.publishedAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    {isHindi ? 'शेयर' : 'Share'}
                                </Button>
                            </div>
                        </header>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {isHindi ? blogPost.contentHi : (blogPost.contentEn || blogPost.contentHi)}
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
