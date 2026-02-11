'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageToggle({ className, onClick }: { className?: string; onClick?: () => void }) {
    const locale = useLocale();
    const pathname = usePathname();
    const otherLocale = locale === 'hi' ? 'en' : 'hi';

    return (
        <Button variant="ghost" size="sm" asChild className={cn("gap-2", className)}>
            <Link href={pathname} locale={otherLocale} onClick={onClick}>
                <Globe className="h-4 w-4" />
                <span className="font-medium">
                    {otherLocale === 'hi' ? 'हिंदी में देखें' : 'Switch to English'}
                </span>
            </Link>
        </Button>
    );
}
