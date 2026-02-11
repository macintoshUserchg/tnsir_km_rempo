'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    FileText,
    Newspaper,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    PlusCircle,
    Menu
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import LanguageToggle from './LanguageToggle';

type AdminUser = {
    name?: string | null;
    email?: string | null;
    role?: string;
};

interface SidebarProps {
    locale: string;
    user: AdminUser;
    className?: string;
    onNavigate?: () => void;
}

const SidebarContent = ({ locale, user, onNavigate }: SidebarProps) => {
    const pathname = usePathname();
    const isHindi = locale === 'hi';

    const navItems = [
        {
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            label: isHindi ? 'डैशबोर्ड' : 'Dashboard'
        },
        {
            href: '/admin/applications/new',
            icon: PlusCircle,
            label: isHindi ? 'नया आवेदन' : 'New Application',
            highlight: true
        },
        {
            href: '/admin/applications',
            icon: FileText,
            label: isHindi ? 'आवेदन' : 'Applications'
        },
        {
            href: '/admin/press-releases',
            icon: Newspaper,
            label: isHindi ? 'प्रेस विज्ञप्ति' : 'Press Releases'
        },
        {
            href: '/admin/blogs',
            icon: BookOpen,
            label: isHindi ? 'ब्लॉग' : 'Blogs'
        },
        {
            href: '/admin/reports',
            icon: BarChart3,
            label: isHindi ? 'रिपोर्ट' : 'Reports'
        },
    ];

    const isActive = (href: string) => pathname.includes(href);

    return (
        <div className="flex flex-col h-full bg-white text-sm font-medium">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <h1 className="text-xl sm:text-2xl font-bold text-orange-600">
                    {isHindi ? 'एडमिन पैनल' : 'Admin Panel'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">{user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            'highlight' in item && item.highlight
                                ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm'
                                : isActive(item.href)
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                        )}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <Link
                    href="/admin/settings"
                    onClick={onNavigate}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive('/admin/settings')
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                    )}
                >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
                </Link>

                <LanguageToggle
                    className="w-full justify-start px-3 py-2.5 h-auto text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    onClick={onNavigate}
                />

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2.5 h-auto text-sm font-medium"
                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span>{isHindi ? 'लॉगआउट' : 'Logout'}</span>
                </Button>
            </div>
        </div>
    );
};

export default function AdminSidebar(props: SidebarProps) {
    return (
        <aside className={cn("w-64 border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0", props.className)}>
            <SidebarContent {...props} />
        </aside>
    );
}

export function AdminMobileSidebar(props: SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
                <div className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Main navigation for admin panel</SheetDescription>
                </div>
                <SidebarContent {...props} onNavigate={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}
