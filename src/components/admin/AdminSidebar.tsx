'use client';

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
    Users,
    PlusCircle
} from 'lucide-react';

type AdminUser = {
    name?: string | null;
    email?: string | null;
    role?: string;
};

interface AdminSidebarProps {
    locale: string;
    user: AdminUser;
}

export default function AdminSidebar({ locale, user }: AdminSidebarProps) {
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
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-orange-600">
                    {isHindi ? 'एडमिन पैनल' : 'Admin Panel'}
                </h1>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${'highlight' in item && item.highlight
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : isActive(item.href)
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <Link
                    href="/admin/settings"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive('/admin/settings')
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <Settings className="h-5 w-5" />
                    <span>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                >
                    <LogOut className="h-5 w-5" />
                    <span>{isHindi ? 'लॉगआउट' : 'Logout'}</span>
                </Button>
            </div>
        </aside>
    );
}
