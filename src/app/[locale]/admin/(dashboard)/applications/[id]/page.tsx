import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Phone, MapPin, User, Calendar } from 'lucide-react';
import prisma from '@/lib/db';
import { Link } from '@/i18n/navigation';
import StatusUpdateForm from '@/components/admin/StatusUpdateForm';

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export default async function ApplicationDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const isHindi = locale === 'hi';
    const applicationId = parseInt(id);

    const application = await prisma.citizenApp.findUnique({
        where: { id: applicationId },
        include: {
            vidhansabha: true,
            workType: true,
            activityLogs: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!application) {
        notFound();
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        IN_PROGRESS: 'bg-blue-100 text-blue-700',
        RESOLVED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/applications">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {isHindi ? 'वापस' : 'Back'}
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{application.name}</h1>
                    <p className="text-gray-500 font-mono">{application.cNumber}</p>
                </div>
                <Badge className={statusColors[application.status]}>
                    {application.status}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Applicant Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{isHindi ? 'आवेदक विवरण' : 'Applicant Details'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'नाम' : 'Name'}</p>
                                        <p className="font-medium">{application.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'पिता का नाम' : "Father's Name"}</p>
                                        <p className="font-medium">{application.fatherName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'मोबाइल' : 'Mobile'}</p>
                                        <p className="font-medium">{application.mobile}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'दिनांक' : 'Date'}</p>
                                        <p className="font-medium">
                                            {new Date(application.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">{isHindi ? 'पता' : 'Address'}</p>
                                    <p className="font-medium">{application.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{isHindi ? 'आवेदन विवरण' : 'Application Details'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">{isHindi ? 'प्रकार' : 'Type'}</p>
                                    <Badge variant="outline">
                                        {application.type === 'CITIZEN'
                                            ? (isHindi ? 'नागरिक' : 'Citizen')
                                            : (isHindi ? 'जनप्रतिनिधि' : 'Public Representative')}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{isHindi ? 'विधानसभा' : 'Vidhansabha'}</p>
                                    <p className="font-medium">
                                        {isHindi ? application.vidhansabha.nameHi : application.vidhansabha.nameEn}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{isHindi ? 'कार्य प्रकार' : 'Work Type'}</p>
                                    <p className="font-medium">
                                        {isHindi ? application.workType.nameHi : application.workType.nameEn}
                                    </p>
                                </div>
                                {application.post && (
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'पद' : 'Post'}</p>
                                        <p className="font-medium">{application.post}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">{isHindi ? 'विवरण' : 'Description'}</p>
                                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                    {application.description}
                                </p>
                            </div>
                            {application.fileUrl && (
                                <div>
                                    <a
                                        href={application.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-orange-600 hover:underline"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {isHindi ? 'संलग्न फाइल देखें' : 'View Attached File'}
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Update Form */}
                    <StatusUpdateForm
                        applicationId={application.id}
                        currentStatus={application.status}
                        locale={locale}
                    />

                    {/* Activity Log */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{isHindi ? 'गतिविधि लॉग' : 'Activity Log'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {application.activityLogs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-orange-200 pl-4">
                                        <p className="font-medium text-sm">{log.action}</p>
                                        {log.note && <p className="text-sm text-gray-600">{log.note}</p>}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(log.createdAt).toLocaleString(isHindi ? 'hi-IN' : 'en-IN')}
                                            {log.performedBy && ` • ${log.performedBy}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
