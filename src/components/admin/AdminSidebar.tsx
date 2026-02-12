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
    Menu,
    Sun,
    Moon
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
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

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
        {
            href: '/admin/pages',
            icon: FileText,
            label: isHindi ? 'पेज' : 'Pages'
        },
        {
            href: '/admin/menus',
            icon: Menu,
            label: isHindi ? 'नेविगेशन' : 'Navigation'
        },
    ];

    const isActive = (href: string) => pathname.includes(href);

    return (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground dashboard-body">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-sidebar-border">
                <h1 className="dashboard-title text-xl sm:text-2xl text-orange-600">
                    {isHindi ? 'एडमिन पैनल' : 'Admin Panel'}
                </h1>
                <p className="dashboard-mono text-xs sm:text-sm text-sidebar-foreground/60 truncate mt-1">{user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto custom-scrollbar">
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
                                    ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-500'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent hover:text-sidebar-foreground'
                        )}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-2">
                <ThemeToggle locale={locale} />

                <Link
                    href="/admin/settings"
                    onClick={onNavigate}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive('/admin/settings')
                            ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-500'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span>{isHindi ? 'सेटिंग्स' : 'Settings'}</span>
                </Link>

                <LanguageToggle
                    className="w-full justify-start px-3 py-2.5 h-auto text-sidebar-foreground/70 hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                    onClick={onNavigate}
                />

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 px-3 py-2.5 h-auto text-sm font-medium transition-colors"
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
        <aside className={cn("w-72 border-r border-sidebar-border hidden md:flex flex-col h-screen sticky top-0", props.className)}>
            <SidebarContent {...props} />
        </aside>
    );
}

export function AdminMobileSidebar(props: SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[230px] sm:w-[260px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
                <div className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Main navigation for admin panel</SheetDescription>
                </div>
                <SidebarContent {...props} onNavigate={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}

const ThemeToggle = ({ locale }: { locale: string }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isHindi = locale === 'hi';

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-muted-foreground">
            <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">
                    {isHindi ? 'लाइट मोड' : 'Light Mode'}
                </span>
            </div>
            <div className="w-9 h-5 bg-muted rounded-full" />
        </div>
    );

    const isDark = theme === 'dark';

    return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
                {isDark ? (
                    <Moon className="h-5 w-5 text-orange-600" />
                ) : (
                    <Sun className="h-5 w-5 text-orange-600" />
                )}
                <span className="text-sm font-medium text-foreground">
                    {isHindi ? (isDark ? 'डार्क मोड' : 'लाइट मोड') : (isDark ? 'Dark Mode' : 'Light Mode')}
                </span>
            </div>
            <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
        </div>
    );
};

