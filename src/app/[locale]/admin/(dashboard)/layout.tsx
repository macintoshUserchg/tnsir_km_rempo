import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
        <div className="min-h-screen flex bg-gray-100">
            <AdminSidebar locale={locale} user={session.user} />
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
