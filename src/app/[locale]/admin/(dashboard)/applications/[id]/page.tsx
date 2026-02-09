import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Phone, MapPin, User, Calendar, Briefcase, Clock, Image, Download, ExternalLink } from 'lucide-react';
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
            documents: true,
        },
    });

    if (!application) {
        notFound();
    }

    const statusConfig: Record<string, { label: { hi: string; en: string }; style: string; dotColor: string }> = {
        PENDING: { label: { hi: 'लंबित', en: 'Pending' }, style: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200', dotColor: 'bg-amber-500' },
        IN_PROGRESS: { label: { hi: 'प्रगति में', en: 'In Progress' }, style: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200', dotColor: 'bg-purple-500' },
        RESOLVED: { label: { hi: 'समाधान', en: 'Resolved' }, style: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200', dotColor: 'bg-emerald-500' },
        REJECTED: { label: { hi: 'अस्वीकृत', en: 'Rejected' }, style: 'bg-red-100 text-red-700 ring-1 ring-red-200', dotColor: 'bg-red-500' },
    };

    const currentStatus = statusConfig[application.status] || statusConfig.PENDING;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href="/admin/applications">
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        {isHindi ? 'वापस' : 'Back'}
                    </Button>
                </Link>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{application.name}</h1>
                        <p className="text-gray-500 font-mono text-sm mt-1">#{application.cNumber}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStatus.style}`}>
                            {isHindi ? currentStatus.label.hi : currentStatus.label.en}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Applicant Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'आवेदक विवरण' : 'Applicant Details'}</CardTitle>
                                    <CardDescription>{isHindi ? 'व्यक्तिगत जानकारी' : 'Personal information'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'नाम' : 'Name'}</p>
                                    <p className="font-semibold text-gray-900">{application.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'पिता का नाम' : "Father's Name"}</p>
                                    <p className="font-semibold text-gray-900">{application.fatherName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'मोबाइल' : 'Mobile'}</p>
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {application.mobile}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'दिनांक' : 'Date'}</p>
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {new Date(application.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'पता' : 'Address'}</p>
                                    <p className="font-semibold text-gray-900 flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        {application.address}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'आवेदन विवरण' : 'Application Details'}</CardTitle>
                                    <CardDescription>{isHindi ? 'कार्य और श्रेणी की जानकारी' : 'Work and category information'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'प्रकार' : 'Type'}</p>
                                    <Badge variant="outline" className="font-medium">
                                        {application.type === 'CITIZEN'
                                            ? (isHindi ? 'नागरिक' : 'Citizen')
                                            : (isHindi ? 'जनप्रतिनिधि' : 'Public Representative')}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'विधानसभा' : 'Vidhansabha'}</p>
                                    <p className="font-semibold text-gray-900">
                                        {isHindi ? application.vidhansabha.nameHi : (application.vidhansabha.nameEn || application.vidhansabha.nameHi)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">{isHindi ? 'कार्य प्रकार' : 'Work Type'}</p>
                                    <p className="font-semibold text-gray-900">
                                        {isHindi ? application.workType.nameHi : (application.workType.nameEn || application.workType.nameHi)}
                                    </p>
                                </div>
                                {application.post && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">{isHindi ? 'पद' : 'Post'}</p>
                                        <p className="font-semibold text-gray-900">{application.post}</p>
                                    </div>
                                )}
                            </div>

                            {application.description && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">{isHindi ? 'विवरण' : 'Description'}</p>
                                    <div className="bg-gray-50 rounded-xl p-4 border">
                                        <p className="text-gray-700 whitespace-pre-wrap">{application.description}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    {(application.documents.length > 0 || application.fileUrl) && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-gray-50/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{isHindi ? 'संलग्न दस्तावेज़' : 'Attached Documents'}</CardTitle>
                                        <CardDescription>{isHindi ? 'अपलोड की गई फाइलें' : 'Uploaded files'}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {application.documents.map((doc) => (
                                        <a
                                            key={doc.id}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block"
                                        >
                                            {doc.type === 'IMAGE' ? (
                                                <div className="aspect-square relative rounded-xl overflow-hidden border hover:ring-2 hover:ring-orange-500 transition-all">
                                                    <img
                                                        src={doc.url}
                                                        alt={doc.originalName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 border rounded-xl hover:ring-2 hover:ring-orange-500 transition-all flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FileText className="h-6 w-6 text-red-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{doc.originalName}</p>
                                                        <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </a>
                                    ))}

                                    {application.fileUrl && !application.documents.length && (
                                        <a
                                            href={application.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 border rounded-xl hover:ring-2 hover:ring-orange-500 transition-all flex items-center gap-3"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900">{isHindi ? 'संलग्न फ़ाइल' : 'Attached File'}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <ExternalLink className="h-3 w-3" />
                                                    {isHindi ? 'देखने के लिए क्लिक करें' : 'Click to view'}
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'गतिविधि लॉग' : 'Activity Log'}</CardTitle>
                                    <CardDescription>{isHindi ? 'कार्रवाई का इतिहास' : 'Action history'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {application.activityLogs.length > 0 ? (
                                <div className="space-y-4">
                                    {application.activityLogs.map((log, index) => (
                                        <div key={log.id} className="relative flex gap-4">
                                            {/* Timeline Line */}
                                            {index < application.activityLogs.length - 1 && (
                                                <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200" />
                                            )}
                                            {/* Dot */}
                                            <div className="w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-100 flex-shrink-0 mt-1" />
                                            {/* Content */}
                                            <div className="flex-1 pb-4">
                                                <p className="font-semibold text-gray-900 text-sm">{log.action}</p>
                                                {log.note && <p className="text-sm text-gray-600 mt-1">{log.note}</p>}
                                                <p className="text-xs text-gray-400 mt-1.5">
                                                    {new Date(log.createdAt).toLocaleString(isHindi ? 'hi-IN' : 'en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                    {log.performedBy && ` • ${log.performedBy}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">{isHindi ? 'कोई गतिविधि नहीं' : 'No activity yet'}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
