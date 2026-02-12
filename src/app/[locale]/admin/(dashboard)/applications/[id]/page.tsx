import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Phone, MapPin, User, Calendar, Briefcase, Clock, Image, Download, ExternalLink, Eye } from 'lucide-react';
import prisma from '@/lib/db';
import { Link } from '@/i18n/navigation';
import StatusUpdateForm from '@/components/admin/StatusUpdateForm';
import ApplicationStatusBadge from '@/components/admin/ApplicationStatusBadge';

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

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-border pb-6">
                <Link href="/admin/applications">
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors pl-0 pr-4">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">{isHindi ? 'वापस' : 'Back'}</span>
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="dashboard-title">{application.name}</h1>
                                <Badge variant="secondary" className="font-mono text-xs font-normal bg-muted text-muted-foreground border-border px-2 py-0.5">
                                    #{application.cNumber}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 dashboard-label">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-muted-foreground/60" />
                                    {new Date(application.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-muted-foreground/60" />
                                    {application.mobile}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-start sm:self-center">
                            <ApplicationStatusBadge status={application.status} locale={locale} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Applicant Details */}
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center ring-1 ring-blue-100 dark:ring-blue-900/40">
                                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'आवेदक विवरण' : 'Applicant Information'}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1.5">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'पूरा नाम' : 'Full Name'}</p>
                                    <p className="dashboard-body">{application.name}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'पिता / पति का नाम' : "Father's / Husband's Name"}</p>
                                    <p className="dashboard-body">{application.fatherName}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'संपर्क नंबर' : 'Contact Number'}</p>
                                    <p className="dashboard-body font-mono tracking-wide">{application.mobile}</p>
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'पता' : 'Address'}</p>
                                    <p className="dashboard-body leading-relaxed">{application.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Details */}
                    <Card className="border border-border shadow-sm overflow-hidden group hover:shadow-md transition-shadow bg-card">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center ring-1 ring-green-100 dark:ring-green-900/40">
                                    <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'आवेदन विवरण' : 'Application Details'}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1.5">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'आवेदक श्रेणी' : 'Applicant Category'}</p>
                                    <div>
                                        <Badge variant="outline" className="font-medium rounded-md px-2.5 py-0.5 border-border text-foreground/80 bg-muted">
                                            {application.type === 'CITIZEN'
                                                ? (isHindi ? 'नागरिक' : 'Citizen')
                                                : (isHindi ? 'जनप्रतिनिधि' : 'Public Representative')}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'विधानसभा क्षेत्र' : 'Constituency (Vidhansabha)'}</p>
                                    <p className="dashboard-body">
                                        {isHindi ? application.vidhansabha.nameHi : (application.vidhansabha.nameEn || application.vidhansabha.nameHi)}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'कार्य का प्रकार' : 'Work Type'}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                        <p className="dashboard-body">
                                            {isHindi ? application.workType.nameHi : (application.workType.nameEn || application.workType.nameHi)}
                                        </p>
                                    </div>
                                </div>
                                {application.post && (
                                    <div className="space-y-1.5">
                                        <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'पद / ओहदा' : 'Designation / Post'}</p>
                                        <p className="dashboard-body">{application.post}</p>
                                    </div>
                                )}
                            </div>

                            {application.description && (
                                <div className="space-y-2">
                                    <p className="dashboard-label uppercase tracking-wider">{isHindi ? 'विस्तृत विवरण' : 'Detailed Description'}</p>
                                    <div className="bg-muted/50 rounded-xl p-5 border border-border ring-1 ring-foreground/5">
                                        <p className="dashboard-body whitespace-pre-wrap leading-relaxed">{application.description}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    {(application.documents.length > 0 || application.fileUrl) && (
                        <Card className="dashboard-card border-0">
                            <CardHeader className="border-b border-border bg-muted/30 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center ring-1 ring-purple-100 dark:ring-purple-900/40">
                                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="dashboard-section">{isHindi ? 'संलग्न दस्तावेज़' : 'Attached Documents'}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {application.documents.map((doc) => (
                                        <a
                                            key={doc.id}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/doc block bg-card rounded-xl border border-border overflow-hidden hover:border-orange-500 hover:ring-1 hover:ring-orange-500 transition-all shadow-sm hover:shadow-md"
                                        >
                                            {doc.type === 'IMAGE' ? (
                                                <div className="aspect-[4/3] relative bg-muted">
                                                    <img
                                                        src={doc.url}
                                                        alt={doc.originalName}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/doc:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-end p-3">
                                                        <div className="text-white text-xs font-medium flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {isHindi ? 'देखें' : 'View'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-[4/3] flex flex-col items-center justify-center p-4 bg-muted/30 text-center gap-2 group-hover/doc:bg-card transition-colors">
                                                    <div className="w-12 h-12 bg-card rounded-lg shadow-sm border border-border flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-muted-foreground group-hover/doc:text-orange-500 transition-colors" />
                                                    </div>
                                                    <div className="w-full">
                                                        <p className="text-xs font-medium text-foreground truncate px-2">{doc.originalName}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
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
                                            className="group/doc flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-orange-500 hover:ring-1 hover:ring-orange-500 transition-all shadow-sm hover:shadow-md sm:col-span-2"
                                        >
                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 group-hover/doc:bg-orange-50 dark:group-hover:bg-orange-950/20 transition-colors">
                                                <ExternalLink className="h-5 w-5 text-muted-foreground group-hover/doc:text-orange-600 transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="dashboard-section group-hover/doc:text-orange-700 transition-colors">{isHindi ? 'मुख्य संलग्नक' : 'Main Attachment'}</p>
                                                <p className="dashboard-label truncate mt-0.5 max-w-xs">{isHindi ? 'दस्तावेज़ देखने के लिए क्लिक करें' : 'Click to view document'}</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Status Update Form */}
                    <div className="bg-card rounded-xl border border-border shadow-sm p-1">
                        <StatusUpdateForm
                            applicationId={application.id}
                            currentStatus={application.status}
                            locale={locale}
                        />
                    </div>

                    {/* Activity Log */}
                    <Card className="dashboard-card border-0 h-fit">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center ring-1 ring-orange-100 dark:ring-orange-900/40">
                                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'गतिविधि इतिहास' : 'Activity Timeline'}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {application.activityLogs.length > 0 ? (
                                <div className="relative pl-2 space-y-8 before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
                                    {application.activityLogs.map((log, index) => (
                                        <div key={log.id} className="relative pl-6 sm:pl-8 group">
                                            {/* Dot */}
                                            <div className="absolute left-0 top-1.5 -ml-[5px] h-3 w-3 rounded-full border-2 border-background bg-muted-foreground/30 ring-4 ring-background group-first:bg-orange-500 group-first:ring-orange-500/20 transition-all" />

                                            {/* Content */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                                <p className="dashboard-section text-sm group-first:text-orange-600">{log.action}</p>
                                                <span className="dashboard-label font-mono flex-shrink-0">
                                                    {new Date(log.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                </span>
                                            </div>
                                            {log.note && (
                                                <div className="mt-1.5 bg-muted/30 rounded-lg p-2.5 dashboard-label border border-border">
                                                    {log.note}
                                                </div>
                                            )}
                                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.createdAt).toLocaleTimeString(isHindi ? 'hi-IN' : 'en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                {log.performedBy && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{log.performedBy}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 px-4">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{isHindi ? 'कोई गतिविधि दर्ज नहीं' : 'No activity recorded yet'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{isHindi ? 'नया अपडेट आने पर यहाँ दिखेगा' : 'Updates will appear here'}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
