import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, BookOpen, Calendar, User, ExternalLink, FileText } from 'lucide-react';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function BlogsAdminPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    const blogs = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    const publishedCount = blogs.filter(b => b.published).length;
    const draftCount = blogs.length - publishedCount;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {isHindi ? 'ब्लॉग प्रबंधन' : 'Blog Posts'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isHindi ? `कुल ${blogs.length} ब्लॉग` : `Total ${blogs.length} blog posts`}
                    </p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                        <Plus className="h-4 w-4" />
                        {isHindi ? 'नया ब्लॉग' : 'New Post'}
                    </Button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                            <p className="text-sm text-gray-500">{isHindi ? 'कुल' : 'Total'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                            <p className="text-sm text-gray-500">{isHindi ? 'प्रकाशित' : 'Published'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm sm:col-span-1 col-span-2">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
                            <p className="text-sm text-gray-500">{isHindi ? 'ड्राफ्ट' : 'Drafts'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Blog Posts List */}
            <div className="space-y-3">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <Card key={blog.id} className="border-0 shadow-sm hover:shadow-md transition-all group">
                            <CardContent className="p-0">
                                <div className="flex items-center">
                                    {/* Left Color Bar */}
                                    <div className={`w-1.5 self-stretch rounded-l-xl ${blog.published ? 'bg-emerald-500' : 'bg-gray-300'}`} />

                                    <div className="flex-1 p-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="h-5 w-5 text-gray-500" />
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                                    {isHindi ? blog.titleHi : (blog.titleEn || blog.titleHi)}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3.5 w-3.5" />
                                                        Admin
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(blog.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Badge
                                                variant={blog.published ? 'default' : 'secondary'}
                                                className={blog.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                                            >
                                                {blog.published ? (isHindi ? 'प्रकाशित' : 'Published') : (isHindi ? 'ड्राफ्ट' : 'Draft')}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                                        <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                                        <Edit className="h-4 w-4 text-gray-400 hover:text-orange-600" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                                {isHindi ? 'कोई ब्लॉग नहीं मिला' : 'No blog posts found'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {isHindi ? 'नया ब्लॉग पोस्ट जोड़ें' : 'Add a new blog post'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
