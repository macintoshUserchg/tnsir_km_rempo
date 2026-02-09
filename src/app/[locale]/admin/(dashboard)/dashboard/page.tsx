import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';

    // Fetch statistics
    const [totalApplications, pendingApplications, resolvedApplications, rejectedApplications] = await Promise.all([
        prisma.citizenApp.count(),
        prisma.citizenApp.count({ where: { status: 'PENDING' } }),
        prisma.citizenApp.count({ where: { status: 'RESOLVED' } }),
        prisma.citizenApp.count({ where: { status: 'REJECTED' } }),
    ]);

    // Fetch recent applications
    const recentApplications = await prisma.citizenApp.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            vidhansabha: true,
            workType: true,
        },
    });

    const stats = [
        {
            title: isHindi ? 'कुल आवेदन' : 'Total Applications',
            value: totalApplications,
            icon: FileText,
            color: 'bg-blue-500',
        },
        {
            title: isHindi ? 'लंबित' : 'Pending',
            value: pendingApplications,
            icon: Clock,
            color: 'bg-yellow-500',
        },
        {
            title: isHindi ? 'समाधान' : 'Resolved',
            value: resolvedApplications,
            icon: CheckCircle,
            color: 'bg-green-500',
        },
        {
            title: isHindi ? 'अस्वीकृत' : 'Rejected',
            value: rejectedApplications,
            icon: XCircle,
            color: 'bg-red-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                </h1>
                <p className="text-gray-500">
                    {isHindi ? 'आवेदनों और गतिविधियों का अवलोकन' : 'Overview of applications and activities'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Applications */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'हाल के आवेदन' : 'Recent Applications'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentApplications.length > 0 ? (
                        <div className="space-y-4">
                            {recentApplications.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{app.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {isHindi ? app.vidhansabha.nameHi : (app.vidhansabha.nameEn || app.vidhansabha.nameHi)} •
                                            {isHindi ? app.workType.nameHi : (app.workType.nameEn || app.workType.nameHi)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                    app.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(app.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            {isHindi ? 'कोई आवेदन नहीं मिला' : 'No applications found'}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
