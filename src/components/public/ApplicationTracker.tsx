'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getApplicationStatus } from '@/app/actions/application';

interface ActivityLog {
    id: number;
    action: string;
    note: string | null;
    performedBy: string | null;
    createdAt: Date;
}

interface ApplicationData {
    cNumber: string;
    name: string;
    status: string;
    createdAt: Date;
    activityLogs: ActivityLog[];
}

interface ApplicationTrackerProps {
    locale: string;
    initialCNumber?: string;
}

export default function ApplicationTracker({ locale, initialCNumber }: ApplicationTrackerProps) {
    const isHindi = locale === 'hi';
    const [cNumber, setCNumber] = useState(initialCNumber || '');
    const [application, setApplication] = useState<ApplicationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cNumber.trim()) return;

        setError(null);
        setApplication(null);

        startTransition(async () => {
            const result = await getApplicationStatus(cNumber.trim());
            if (result) {
                setApplication(result as ApplicationData);
            } else {
                setError(
                    isHindi
                        ? 'आवेदन नहीं मिला। कृपया अपना आवेदन नंबर जांचें।'
                        : 'Application not found. Please check your application number.'
                );
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; labelHi: string; className: string; icon: React.ReactNode }> = {
            PENDING: {
                label: 'Pending',
                labelHi: 'लंबित',
                className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                icon: <Clock className="h-4 w-4" />,
            },
            IN_PROGRESS: {
                label: 'In Progress',
                labelHi: 'प्रगति में',
                className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                icon: <AlertCircle className="h-4 w-4" />,
            },
            RESOLVED: {
                label: 'Resolved',
                labelHi: 'हल किया गया',
                className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                icon: <CheckCircle className="h-4 w-4" />,
            },
            REJECTED: {
                label: 'Rejected',
                labelHi: 'अस्वीकृत',
                className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                icon: <XCircle className="h-4 w-4" />,
            },
        };

        const config = statusConfig[status] || statusConfig.PENDING;
        return (
            <Badge className={`flex items-center gap-1.5 px-3 py-1 ${config.className}`}>
                {config.icon}
                {isHindi ? config.labelHi : config.label}
            </Badge>
        );
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    type="text"
                    placeholder={isHindi ? 'आवेदन नंबर दर्ज करें (जैसे: 20260212-ABC123)' : 'Enter application number (e.g., 20260212-ABC123)'}
                    value={cNumber}
                    onChange={(e) => setCNumber(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={isPending} className="bg-orange-600 hover:bg-orange-700">
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">
                        {isHindi ? 'खोजें' : 'Search'}
                    </span>
                </Button>
            </form>

            {/* Error Message */}
            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
                        {error}
                    </CardContent>
                </Card>
            )}

            {/* Application Result */}
            {application && (
                <Card className="border-border">
                    <CardHeader className="border-b border-border bg-muted/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg">
                                    {isHindi ? 'आवेदन विवरण' : 'Application Details'}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isHindi ? 'आवेदन नंबर: ' : 'Application Number: '}
                                    <span className="font-mono font-bold">{application.cNumber}</span>
                                </p>
                            </div>
                            {getStatusBadge(application.status)}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4 mb-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {isHindi ? 'आवेदक का नाम' : 'Applicant Name'}
                                    </p>
                                    <p className="font-medium">{application.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {isHindi ? 'आवेदन तिथि' : 'Application Date'}
                                    </p>
                                    <p className="font-medium">{formatDate(application.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div>
                            <h3 className="font-semibold mb-4">
                                {isHindi ? 'गतिविधि इतिहास' : 'Activity History'}
                            </h3>
                            <div className="space-y-4">
                                {application.activityLogs.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className="flex gap-4 items-start"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${index === 0
                                                    ? 'bg-orange-600'
                                                    : 'bg-muted-foreground/30'
                                                }`} />
                                            {index < application.activityLogs.length - 1 && (
                                                <div className="w-0.5 h-full bg-border min-h-8" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-medium text-sm">
                                                {log.action.replace(/_/g, ' ')}
                                            </p>
                                            {log.note && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {log.note}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(log.createdAt)}
                                                {log.performedBy && ` • ${log.performedBy}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
