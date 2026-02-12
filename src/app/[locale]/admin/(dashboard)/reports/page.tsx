import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, BarChart3, PieChartIcon, TrendingUp, FileText, Clock, CheckCircle, MapPin } from 'lucide-react';
import prisma from '@/lib/db';
import StatusPieChart from '@/components/admin/charts/StatusPieChart';
import VidhansabhaBarChart from '@/components/admin/charts/VidhansabhaBarChart';
import MonthlyTrendChart from '@/components/admin/charts/MonthlyTrendChart';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function ReportsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    // Fetch statistics by status
    const statusStats = await prisma.citizenApp.groupBy({
        by: ['status'],
        _count: { id: true },
    });

    const statusData = statusStats.map((stat) => ({
        name: stat.status === 'PENDING' ? (isHindi ? 'लंबित' : 'Pending') :
            stat.status === 'IN_PROGRESS' ? (isHindi ? 'प्रगति में' : 'In Progress') :
                stat.status === 'RESOLVED' ? (isHindi ? 'समाधान' : 'Resolved') :
                    (isHindi ? 'अस्वीकृत' : 'Rejected'),
        value: stat._count.id,
        color: stat.status === 'PENDING' ? '#f59e0b' :
            stat.status === 'IN_PROGRESS' ? '#8b5cf6' :
                stat.status === 'RESOLVED' ? '#10b981' : '#ef4444',
    }));

    // Fetch statistics by vidhansabha
    const vidhansabhaStats = await prisma.citizenApp.groupBy({
        by: ['vidhansabhaId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
    });

    const vidhansabhas = await prisma.vidhansabha.findMany();
    const vidhansabhaMap = Object.fromEntries(vidhansabhas.map(v => [v.id, v]));

    const vidhansabhaData = vidhansabhaStats.map((stat) => ({
        name: isHindi ? vidhansabhaMap[stat.vidhansabhaId]?.nameHi :
            (vidhansabhaMap[stat.vidhansabhaId]?.nameEn || vidhansabhaMap[stat.vidhansabhaId]?.nameHi),
        count: stat._count.id,
    }));

    // Fetch monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyApps = await prisma.citizenApp.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
    });

    const monthlyData: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', { month: 'short', year: '2-digit' });
        const count = monthlyApps.filter(app => {
            const appDate = new Date(app.createdAt);
            return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
        }).length;
        monthlyData.push({ month: monthKey, count });
    }

    // Fetch statistics by work type
    const workTypeStats = await prisma.citizenApp.groupBy({
        by: ['workTypeId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
    });

    const workTypes = await prisma.workType.findMany();
    const workTypeMap = Object.fromEntries(workTypes.map(w => [w.id, w]));

    // Total counts
    const totalApps = await prisma.citizenApp.count();
    const resolvedCount = statusStats.find(s => s.status === 'RESOLVED')?._count.id || 0;
    const pendingCount = statusStats.find(s => s.status === 'PENDING')?._count.id || 0;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="dashboard-title">
                        {isHindi ? 'रिपोर्ट्स और विश्लेषण' : 'Reports & Analytics'}
                    </h1>
                    <p className="dashboard-body mt-1">
                        {isHindi ? `कुल ${totalApps} आवेदनों का विश्लेषण` : `Analytics for ${totalApps} total applications`}
                    </p>
                </div>
                <a href={`/api/export/applications`} download>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 text-white">
                        <Download className="h-4 w-4" />
                        {isHindi ? 'Excel में निर्यात करें' : 'Export to Excel'}
                    </Button>
                </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="dashboard-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/10 border-0">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="dashboard-stat">{totalApps}</p>
                            <p className="dashboard-label">{isHindi ? 'कुल' : 'Total'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="dashboard-card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/10 border-0">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="dashboard-stat">{resolvedCount}</p>
                            <p className="dashboard-label">{isHindi ? 'समाधान' : 'Resolved'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="dashboard-card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/10 border-0">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="dashboard-stat">{pendingCount}</p>
                            <p className="dashboard-label">{isHindi ? 'लंबित' : 'Pending'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="dashboard-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/10 border-0">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="dashboard-stat">
                                {totalApps > 0 ? ((resolvedCount / totalApps) * 100).toFixed(0) : 0}%
                            </p>
                            <p className="dashboard-label">{isHindi ? 'समाधान दर' : 'Resolution'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Status Distribution Pie Chart */}
                <Card className="border-0 shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center shadow-sm">
                                <PieChartIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <CardTitle className="dashboard-section">{isHindi ? 'स्थिति वितरण' : 'Status Distribution'}</CardTitle>
                                <CardDescription className="dashboard-label">{isHindi ? 'आवेदनों की स्थिति के अनुसार' : 'By application status'}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <StatusPieChart data={statusData} locale={locale} />
                    </CardContent>
                </Card>

                {/* Monthly Trend Line Chart */}
                <Card className="border-0 shadow-sm bg-card">
                    <CardHeader className="border-b border-border bg-muted/30 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shadow-sm">
                                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="dashboard-section">{isHindi ? 'मासिक प्रवृत्ति' : 'Monthly Trend'}</CardTitle>
                                <CardDescription className="dashboard-label">{isHindi ? 'पिछले 6 महीनों का डेटा' : 'Last 6 months data'}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <MonthlyTrendChart data={monthlyData} locale={locale} />
                    </CardContent>
                </Card>
            </div>

            {/* Vidhansabha Bar Chart */}
            <Card className="border-0 shadow-sm bg-card">
                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center shadow-sm">
                            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'विधानसभा अनुसार आवेदन' : 'Applications by Vidhansabha'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'शीर्ष 10 विधानसभाएं' : 'Top 10 constituencies'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <VidhansabhaBarChart data={vidhansabhaData} locale={locale} />
                </CardContent>
            </Card>

            {/* Work Type Grid */}
            <Card className="border-0 shadow-sm bg-card">
                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center shadow-sm">
                            <FileSpreadsheet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'कार्य प्रकार अनुसार' : 'By Work Type'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'सभी कार्य श्रेणियां' : 'All work categories'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workTypeStats.map((stat) => {
                            const wt = workTypeMap[stat.workTypeId];
                            const percentage = totalApps > 0 ? ((stat._count.id / totalApps) * 100).toFixed(1) : 0;
                            return (
                                <div key={stat.workTypeId} className="p-4 bg-muted/30 rounded-xl border border-border hover:shadow-sm transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="dashboard-body font-bold text-foreground/80 group-hover:text-orange-600 transition-colors">
                                            {isHindi ? wt?.nameHi : (wt?.nameEn || wt?.nameHi)}
                                        </span>
                                        <span className="dashboard-stat text-orange-600 dark:text-orange-500 text-lg">{stat._count.id}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-2.5 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="dashboard-label mt-2">{percentage}% {isHindi ? 'कुल का' : 'of total'}</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
