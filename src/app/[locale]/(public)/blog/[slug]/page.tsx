import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Share2, BookOpen, FileText } from 'lucide-react';
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
        include: {
            attachments: true
        }
    });

    if (!blogPost) {
        notFound();
    }

    const title = isHindi ? blogPost.titleHi : (blogPost.titleEn || blogPost.titleHi);
    const content = isHindi ? blogPost.contentHi : (blogPost.contentEn || blogPost.contentHi);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/30">
            <Header />
            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-4 sticky top-0 z-10 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <Link href="/blog" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-medium">
                            <ArrowLeft className="h-4 w-4" />
                            {isHindi ? 'सभी ब्लॉग' : 'All Blogs'}
                        </Link>
                    </div>
                </div>

                {/* Blog Content */}
                <article className="py-12 px-4">
                    <div className="container mx-auto max-w-4xl">
                        {/* Header */}
                        <header className="mb-10 text-center">
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-6 border border-orange-100">
                                <BookOpen className="h-3.5 w-3.5" />
                                {isHindi ? 'ब्लॉग' : 'Blog'}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                {title}
                            </h1>

                            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                    <User className="h-4 w-4 text-orange-600" />
                                    <span>{blogPost.author}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    <span>
                                        {blogPost.publishedAt && new Date(blogPost.publishedAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Featured Image */}
                        {blogPost.imageUrl && (
                            <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-orange-500/10 border-4 border-white">
                                <img
                                    src={blogPost.imageUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
                            <div
                                className="prose prose-orange prose-lg max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>

                        {/* Attachments Section */}
                        {blogPost.attachments.length > 0 && (
                            <div className="mt-16 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-gray-200"></div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {isHindi ? 'संलग्नक' : 'Attachments'}
                                    </h2>
                                    <div className="h-px flex-1 bg-gray-200"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {blogPost.attachments.map((at) => (
                                        <div key={at.id} className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 hover:border-orange-500/30 transition-all hover:shadow-lg">
                                            {at.type === 'IMAGE' && (
                                                <div className="space-y-4">
                                                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                                        <img src={at.url} alt="attachment" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    </div>
                                                    <Button variant="outline" className="w-full gap-2" asChild>
                                                        <a href={at.url} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}

                                            {at.type === 'VIDEO' && (
                                                <div className="space-y-4">
                                                    <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
                                                        <video src={at.url} controls className="w-full h-full" />
                                                    </div>
                                                    <Button variant="outline" className="w-full gap-2" asChild>
                                                        <a href={at.url} target="_blank" rel="noopener noreferrer">
                                                            Open Video
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}

                                            {at.type === 'PDF' && (
                                                <div className="flex items-center justify-between p-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 truncate max-w-[150px]">
                                                                {at.titleEn || at.url.split('/').pop()?.substring(0, 20)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">PDF Document</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={at.url} target="_blank" rel="noopener noreferrer">Download</a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
