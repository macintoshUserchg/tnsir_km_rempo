'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AppStatus } from '@prisma/client';

interface ApplicationStatusBadgeProps {
    status: AppStatus | string;
    locale: string;
    className?: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status, locale, className }) => {
    const isHindi = locale === 'hi';

    const styles: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
        IN_PROGRESS: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
        RESOLVED: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
        REJECTED: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    };

    const labels: Record<string, Record<string, string>> = {
        hi: {
            PENDING: 'लंबित',
            IN_PROGRESS: 'प्रगति में',
            RESOLVED: 'समाधान',
            REJECTED: 'अस्वीकृत',
        },
        en: {
            PENDING: 'Pending',
            IN_PROGRESS: 'In Progress',
            RESOLVED: 'Resolved',
            REJECTED: 'Rejected',
        },
    };

    const currentLabels = labels[locale] || labels.en;
    const label = currentLabels[status] || status;
    const style = styles[status] || styles.PENDING;

    return (
        <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block',
            style,
            className
        )}>
            {label}
        </span>
    );
};

export default ApplicationStatusBadge;
