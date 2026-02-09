import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Eye } from 'lucide-react';
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isHindi ? 'ब्लॉग प्रबंधन' : 'Blog Posts'}
                    </h1>
                    <p className="text-gray-500">
                        {isHindi ? `कुल ${blogs.length} ब्लॉग` : `Total ${blogs.length} blog posts`}
                    </p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {isHindi ? 'नया ब्लॉग' : 'New Post'}
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{isHindi ? 'शीर्षक' : 'Title'}</TableHead>
                                <TableHead>{isHindi ? 'लेखक' : 'Author'}</TableHead>
                                <TableHead>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
                                <TableHead>{isHindi ? 'दिनांक' : 'Date'}</TableHead>
                                <TableHead>{isHindi ? 'क्रियाएँ' : 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell>
                                        <p className="font-medium line-clamp-1">
                                            {isHindi ? blog.titleHi : (blog.titleEn || blog.titleHi)}
                                        </p>
                                    </TableCell>
                                    <TableCell>{blog.author}</TableCell>
                                    <TableCell>
                                        <Badge variant={blog.published ? 'default' : 'secondary'}>
                                            {blog.published ? (isHindi ? 'प्रकाशित' : 'Published') : (isHindi ? 'ड्राफ्ट' : 'Draft')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(blog.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Link href={`/blog/${blog.slug}`} target="_blank">
                                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                            </Link>
                                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
