import { setRequestLocale } from 'next-intl/server';
import prisma from '@/lib/db';
import AdminApplicationForm from '@/components/admin/AdminApplicationForm';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function NewApplicationPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    // Fetch dropdown data
    const [vidhansabhas, workTypes] = await Promise.all([
        prisma.vidhansabha.findMany({ orderBy: { nameHi: 'asc' } }),
        prisma.workType.findMany({ orderBy: { nameHi: 'asc' } }),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'नया आवेदन दर्ज करें' : 'Submit New Application'}
                </h1>
                <p className="dashboard-body mt-1">
                    {isHindi
                        ? 'आगंतुक की ओर से आवेदन जमा करें'
                        : 'Submit application on behalf of a visitor'}
                </p>
            </div>

            <AdminApplicationForm
                locale={locale}
                vidhansabhas={vidhansabhas}
                workTypes={workTypes}
            />
        </div>
    );
}
