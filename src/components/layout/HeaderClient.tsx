'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu as MenuIcon, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Menu } from '@prisma/client';

type MenuItem = Menu & { children: Menu[] };

interface HeaderClientProps {
    items: MenuItem[];
}

export default function HeaderClient({ items }: HeaderClientProps) {
    const t = useTranslations('common');
    const locale = useLocale();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isHindi = locale === 'hi';

    const navLinks = items.map(item => ({
        label: isHindi ? item.labelHi : (item.labelEn || item.labelHi),
        href: item.url,
        dropdown: item.children.length > 0 ? item.children.map(child => ({
            label: isHindi ? child.labelHi : (child.labelEn || child.labelHi),
            href: child.url
        })) : undefined
    }));

    const otherLocale = locale === 'hi' ? 'en' : 'hi';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container-custom flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className={cn(
                        "font-bold text-orange-600 transition-all",
                        isHindi
                            ? "text-2xl md:text-3xl tracking-normal"
                            : "text-lg md:text-xl tracking-tight"
                    )}>
                        {t('siteName')}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) =>
                        link.dropdown ? (
                            <DropdownMenu key={link.label}>
                                <DropdownMenuTrigger
                                    className="flex items-center gap-1 transition-colors hover:text-orange-600 focus:outline-none"
                                    style={{
                                        fontSize: 'var(--site-nav-size)',
                                        fontWeight: 'var(--site-nav-weight)'
                                    }}
                                >
                                    {link.label}
                                    <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {link.dropdown.map((item) => (
                                        <DropdownMenuItem key={item.href} asChild>
                                            <Link href={item.href} className="w-full cursor-pointer">
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href!}
                                className="transition-colors hover:text-orange-600"
                                style={{
                                    fontSize: 'var(--site-nav-size)',
                                    fontWeight: 'var(--site-nav-weight)'
                                }}
                            >
                                {link.label}
                            </Link>
                        )
                    )}
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
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <nav className="flex flex-col gap-4 mt-8">

                                {navLinks.map((link) =>
                                    link.dropdown ? (
                                        <div key={link.label} className="flex flex-col gap-2">
                                            <div className="font-medium text-lg text-gray-900">
                                                {link.label}
                                            </div>
                                            <div className="pl-4 flex flex-col gap-2 border-l-2 border-gray-100">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="text-base font-medium text-gray-600 transition-colors hover:text-orange-600"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            key={link.href}
                                            href={link.href!}
                                            className="text-lg font-medium transition-colors hover:text-orange-600"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                )}
                                <Button asChild className="mt-4 bg-orange-600 hover:bg-orange-700">
                                    <Link href="/apply" onClick={() => setIsOpen(false)}>
                                        {t('apply')}
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet >
                </div >
            </div >
        </header >
    );
}
