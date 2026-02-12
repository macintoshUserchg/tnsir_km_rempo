import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, ArrowRight, Calendar, MapPin, User, Eye } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import prisma from '@/lib/db';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    // Fetch statistics using groupBy for better performance
    const statusCounts = await prisma.citizenApp.groupBy({
        by: ['status'],
        _count: true,
    });

    // Map counts to a record for easier access
    const counts = statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
    }, {} as Record<string, number>);

    const totalApplications = Object.values(counts).reduce((a, b) => a + b, 0);
    const pendingApplications = counts['PENDING'] || 0;
    const inProgressApplications = counts['IN_PROGRESS'] || 0;
    const resolvedApplications = counts['RESOLVED'] || 0;
    const rejectedApplications = counts['REJECTED'] || 0;

    // Fetch recent applications
    const recentApplications = await prisma.citizenApp.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            vidhansabha: true,
            workType: true,
        },
    });

    // Today's applications
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayApplications = await prisma.citizenApp.count({
        where: { createdAt: { gte: today } }
    });

    const stats = [
        {
            title: isHindi ? 'कुल आवेदन' : 'Total Applications',
            value: totalApplications,
            icon: FileText,
            gradient: 'from-blue-500 to-blue-600',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: isHindi ? 'लंबित' : 'Pending',
            value: pendingApplications,
            icon: Clock,
            gradient: 'from-amber-500 to-orange-500',
            bgLight: 'bg-amber-50',
            textColor: 'text-amber-600',
        },
        {
            title: isHindi ? 'प्रगति में' : 'In Progress',
            value: inProgressApplications,
            icon: TrendingUp,
            gradient: 'from-purple-500 to-purple-600',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            title: isHindi ? 'समाधान' : 'Resolved',
            value: resolvedApplications,
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-green-600',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isHindi ? 'आवेदनों और गतिविधियों का अवलोकन' : 'Overview of applications and activities'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">
                            {isHindi ? `आज: ${todayApplications} नए` : `Today: ${todayApplications} new`}
                        </span>
                    </div>
                    <Link href="/admin/applications/new">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            {isHindi ? '+ नया आवेदन' : '+ New Application'}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-stretch">
                                <div className={`w-1.5 sm:w-2 bg-gradient-to-b ${stat.gradient}`} />
                                <div className="flex-1 p-3 sm:p-5">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <span className="text-xs sm:text-sm font-medium text-gray-500 truncate mr-2">{stat.title}</span>
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.bgLight} flex items-center justify-center flex-shrink-0`}>
                                            <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.textColor}`} />
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-5">
                {/* Rejected Count */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-50">
                    <CardContent className="p-2 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-4 text-center sm:text-left">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mb-1 sm:mb-0">
                            <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-sm text-gray-500 leading-tight">{isHindi ? 'अस्वीकृत' : 'Rejected'}</p>
                            <p className="text-sm sm:text-2xl font-bold text-gray-900 leading-tight">{rejectedApplications}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Resolution Rate */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
                    <CardContent className="p-2 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-4 text-center sm:text-left">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mb-1 sm:mb-0">
                            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-sm text-gray-500 leading-tight">{isHindi ? 'समाधान' : 'Resolved'}</p>
                            <p className="text-sm sm:text-2xl font-bold text-gray-900 leading-tight">
                                {totalApplications > 0 ? ((resolvedApplications / totalApplications) * 100).toFixed(0) : 0}%
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Rate */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50">
                    <CardContent className="p-2 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-4 text-center sm:text-left">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mb-1 sm:mb-0">
                            <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-sm text-gray-500 leading-tight">{isHindi ? 'लंबित' : 'Pending'}</p>
                            <p className="text-sm sm:text-2xl font-bold text-gray-900 leading-tight">
                                {totalApplications > 0 ? ((pendingApplications / totalApplications) * 100).toFixed(0) : 0}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Applications */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'हाल के आवेदन' : 'Recent Applications'}</CardTitle>
                            <CardDescription>{isHindi ? 'नवीनतम 5 आवेदन' : 'Latest 5 applications'}</CardDescription>
                        </div>
                        <Link href="/admin/applications">
                            <Button variant="outline" size="sm" className="gap-2">
                                {isHindi ? 'सभी देखें' : 'View All'}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {recentApplications.length > 0 ? (
                        <div className="divide-y">
                            {recentApplications.map((app) => (
                                <Link
                                    key={app.id}
                                    href={`/admin/applications/${app.id}`}
                                    className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                {app.name}
                                            </p>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {isHindi ? app.vidhansabha.nameHi : (app.vidhansabha.nameEn || app.vidhansabha.nameHi)}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {isHindi ? app.workType.nameHi : (app.workType.nameEn || app.workType.nameHi)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <ApplicationStatusBadge status={app.status} locale={locale} />
                                            <p className="text-xs text-gray-400 mt-1.5">
                                                {new Date(app.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <Eye className="h-4 w-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                                {isHindi ? 'कोई आवेदन नहीं मिला' : 'No applications found'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                {isHindi ? 'नया आवेदन जोड़ने के लिए बटन पर क्लिक करें' : 'Click the button to add a new application'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
