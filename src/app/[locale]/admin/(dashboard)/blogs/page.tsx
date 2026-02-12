import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, BookOpen, Calendar, User, ExternalLink, FileText } from 'lucide-react';
import prisma from '@/lib/db';
import { cn } from '@/lib/utils';

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
                    <h1 className="dashboard-title">
                        {isHindi ? 'ब्लॉग प्रबंधन' : 'Blog Posts'}
                    </h1>
                    <p className="dashboard-body mt-1">
                        {isHindi ? `कुल ${blogs.length} ब्लॉग प्रविष्टियां` : `Total ${blogs.length} blog entries managed.`}
                    </p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 gap-2">
                        <Plus className="h-4 w-4" />
                        {isHindi ? 'नया ब्लॉग' : 'New Post'}
                    </Button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <Card className="dashboard-card bg-card border border-border/40">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold dashboard-title">{blogs.length}</p>
                            <p className="dashboard-label">{isHindi ? 'कुल' : 'Total'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="dashboard-card bg-card border border-border/40">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                            <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold dashboard-title">{publishedCount}</p>
                            <p className="dashboard-label">{isHindi ? 'प्रकाशित' : 'Published'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="dashboard-card bg-card border border-border/40 sm:col-span-1 col-span-2">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border/40">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold dashboard-title">{draftCount}</p>
                            <p className="dashboard-label">{isHindi ? 'ड्राफ्ट' : 'Drafts'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Blog Posts List */}
            <div className="space-y-4">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <Card key={blog.id} className="dashboard-card border border-border/40 overflow-hidden hover:border-orange-500/30 group">
                            <CardContent className="p-0">
                                <div className="flex items-center">
                                    <div className={`w-1.5 self-stretch ${blog.published ? 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-muted/60'}`} />

                                    <div className="flex-1 p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-bold dashboard-body text-foreground truncate group-hover:text-orange-600 transition-colors">
                                                    {isHindi ? blog.titleHi : (blog.titleEn || blog.titleHi)}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="dashboard-label flex items-center gap-1.5 capitalize">
                                                        <User className="h-3.5 w-3.5" />
                                                        Admin
                                                    </span>
                                                    <span className="dashboard-label flex items-center gap-1.5">
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

                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <span className={cn(
                                                "dashboard-badge",
                                                blog.published
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-500 dark:border-emerald-800"
                                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800"
                                            )}>
                                                {blog.published ? (isHindi ? 'प्रकाशित' : 'Published') : (isHindi ? 'ड्राफ्ट' : 'Draft')}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20" asChild title="View on Site">
                                                    <Link href={`/blog/${blog.slug}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20" asChild title="Edit">
                                                    <Link href={`/admin/blogs/${blog.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-border/40 rounded-xl bg-muted/10 group">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="dashboard-body font-bold text-foreground">
                            {isHindi ? 'कोई ब्लॉग नहीं मिला' : 'No blog posts found'}
                        </h3>
                        <p className="dashboard-label mt-1">
                            {isHindi ? 'नया ब्लॉग पोस्ट जोड़कर शुरुआत करें' : 'Start by adding a new blog post entry.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
