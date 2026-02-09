import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    className?: string;
    centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
    title,
    subtitle,
    className,
    centered = false,
}) => {
    return (
        <div className={cn('mb-8 md:mb-12', centered && 'text-center', className)}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                    {subtitle}
                </p>
            )}
            <div className={cn(
                'mt-4 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full',
                centered && 'mx-auto'
            )} />
        </div>
    );
};
