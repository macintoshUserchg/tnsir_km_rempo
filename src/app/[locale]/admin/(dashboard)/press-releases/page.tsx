import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function PressReleasesAdminPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    const pressReleases = await prisma.pressRelease.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isHindi ? 'प्रेस विज्ञप्ति प्रबंधन' : 'Press Releases'}
                    </h1>
                    <p className="text-gray-500">
                        {isHindi ? `कुल ${pressReleases.length} प्रेस विज्ञप्ति` : `Total ${pressReleases.length} press releases`}
                    </p>
                </div>
                <Link href="/admin/press-releases/new">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {isHindi ? 'नई प्रेस विज्ञप्ति' : 'New Release'}
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{isHindi ? 'शीर्षक' : 'Title'}</TableHead>
                                <TableHead>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
                                <TableHead>{isHindi ? 'दिनांक' : 'Date'}</TableHead>
                                <TableHead>{isHindi ? 'क्रियाएँ' : 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pressReleases.map((pr) => (
                                <TableRow key={pr.id}>
                                    <TableCell>
                                        <p className="font-medium line-clamp-1">
                                            {isHindi ? pr.titleHi : (pr.titleEn || pr.titleHi)}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={pr.published ? 'default' : 'secondary'}>
                                            {pr.published ? (isHindi ? 'प्रकाशित' : 'Published') : (isHindi ? 'ड्राफ्ट' : 'Draft')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(pr.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Link href={`/press-release/${pr.slug}`} target="_blank">
                                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                            </Link>
                                            <Link href={`/admin/press-releases/${pr.id}/edit`}>
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
