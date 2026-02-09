'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const t = useTranslations('common');
    const locale = useLocale();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/biography', label: t('biography') },
        { href: '/press-release', label: t('pressRelease') },
        { href: '/blog', label: t('blog') },
        { href: '/contact', label: t('contact') },
    ];

    const otherLocale = locale === 'hi' ? 'en' : 'hi';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-orange-600">
                        {t('siteName')}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium transition-colors hover:text-orange-600"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Locale Switcher */}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={pathname} locale={otherLocale}>
                            <Globe className="h-5 w-5" />
                            <span className="sr-only">Switch to {otherLocale === 'hi' ? 'Hindi' : 'English'}</span>
                        </Link>
                    </Button>

                    {/* Apply Button */}
                    <Button asChild className="hidden md:flex bg-orange-600 hover:bg-orange-700">
                        <Link href="/apply">{t('apply')}</Link>
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium transition-colors hover:text-orange-600"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button asChild className="mt-4 bg-orange-600 hover:bg-orange-700">
                                    <Link href="/apply" onClick={() => setIsOpen(false)}>
                                        {t('apply')}
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
