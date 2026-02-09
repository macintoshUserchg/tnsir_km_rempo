import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import prisma from '@/lib/db';
import { Link } from '@/i18n/navigation';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const { page = '1' } = await searchParams;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';
    const currentPage = parseInt(page);
    const itemsPerPage = 9;

    const [blogPosts, totalCount] = await Promise.all([
        prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { publishedAt: 'desc' },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        prisma.blogPost.count({ where: { published: true } }),
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {isHindi ? 'ब्लॉग' : 'Blog'}
                        </h1>
                        <p className="text-xl opacity-90">
                            {isHindi
                                ? 'विचार, लेख और अपडेट'
                                : 'Thoughts, articles and updates'}
                        </p>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-6xl">
                        {blogPosts.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogPosts.map((post) => (
                                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Thumbnail */}
                                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                            {post.imageUrl ? (
                                                <img
                                                    src={post.imageUrl}
                                                    alt={isHindi ? post.titleHi : (post.titleEn || post.titleHi)}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400">{isHindi ? 'चित्र' : 'Image'}</span>
                                            )}
                                        </div>
                                        <CardHeader>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{post.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg line-clamp-2 hover:text-orange-600 transition-colors">
                                                <Link href={`/blog/${post.slug}`}>
                                                    {isHindi ? post.titleHi : (post.titleEn || post.titleHi)}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {isHindi
                                                    ? post.contentHi.substring(0, 150) + '...'
                                                    : (post.contentEn || post.contentHi).substring(0, 150) + '...'}
                                            </p>
                                            <Link href={`/blog/${post.slug}`}>
                                                <Button variant="link" className="text-orange-600 p-0 mt-2">
                                                    {isHindi ? 'पूरा पढ़ें →' : 'Read more →'}
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {isHindi ? 'कोई ब्लॉग पोस्ट उपलब्ध नहीं है' : 'No blog posts available'}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                {currentPage > 1 && (
                                    <Link href={`/blog?page=${currentPage - 1}`}>
                                        <Button variant="outline">{isHindi ? 'पिछला' : 'Previous'}</Button>
                                    </Link>
                                )}
                                <span className="flex items-center px-4 text-gray-600">
                                    {currentPage} / {totalPages}
                                </span>
                                {currentPage < totalPages && (
                                    <Link href={`/blog?page=${currentPage + 1}`}>
                                        <Button variant="outline">{isHindi ? 'अगला' : 'Next'}</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
