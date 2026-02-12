import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import * as AdminSidebar from '@/components/admin/AdminSidebar';
import LanguageToggle from '@/components/admin/LanguageToggle';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();

    if (!session?.user) {
        redirect(`/${locale}/admin/login`);
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <AdminSidebar.AdminMobileSidebar key={locale} locale={locale} user={session.user} />
                    <span className="font-bold text-lg text-orange-600">
                        {locale === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}
                    </span>
                </div>
                <LanguageToggle className="text-muted-foreground" />
            </div>

            {/* Desktop Sidebar */}
            <AdminSidebar.default
                key={locale}
                locale={locale}
                user={session.user}
                className="hidden md:flex flex-col w-72 border-r border-border bg-sidebar h-screen sticky top-0 shrink-0"
            />

            <main className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
