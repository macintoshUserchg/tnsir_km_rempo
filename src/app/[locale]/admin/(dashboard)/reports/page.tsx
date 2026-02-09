import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, BarChart3, PieChartIcon, TrendingUp } from 'lucide-react';
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
        color: stat.status === 'PENDING' ? '#eab308' :
            stat.status === 'IN_PROGRESS' ? '#3b82f6' :
                stat.status === 'RESOLVED' ? '#22c55e' : '#ef4444',
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isHindi ? 'रिपोर्ट्स और विश्लेषण' : 'Reports & Analytics'}
                    </h1>
                    <p className="text-gray-500">
                        {isHindi ? `कुल ${totalApps} आवेदनों का विश्लेषण` : `Analytics for ${totalApps} total applications`}
                    </p>
                </div>
                <a href={`/api/export/applications`} download>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        {isHindi ? 'Excel में निर्यात करें' : 'Export to Excel'}
                    </Button>
                </a>
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Status Distribution Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-orange-500" />
                            {isHindi ? 'स्थिति वितरण' : 'Status Distribution'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusPieChart data={statusData} locale={locale} />
                    </CardContent>
                </Card>

                {/* Monthly Trend Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                            {isHindi ? 'मासिक प्रवृत्ति' : 'Monthly Trend'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MonthlyTrendChart data={monthlyData} locale={locale} />
                    </CardContent>
                </Card>
            </div>

            {/* Vidhansabha Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-orange-500" />
                        {isHindi ? 'विधानसभा अनुसार आवेदन' : 'Applications by Vidhansabha'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <VidhansabhaBarChart data={vidhansabhaData} locale={locale} />
                </CardContent>
            </Card>

            {/* Work Type Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-orange-500" />
                        {isHindi ? 'कार्य प्रकार अनुसार' : 'By Work Type'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workTypeStats.map((stat) => {
                            const wt = workTypeMap[stat.workTypeId];
                            const percentage = totalApps > 0 ? ((stat._count.id / totalApps) * 100).toFixed(1) : 0;
                            return (
                                <div key={stat.workTypeId} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">
                                            {isHindi ? wt?.nameHi : (wt?.nameEn || wt?.nameHi)}
                                        </span>
                                        <span className="font-bold text-orange-600">{stat._count.id}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
