import { prisma } from '@/lib/db';
import MenuManager from './MenuManager';

export default async function MenusPage({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    // Fetch all menu items, ordered by position and order
    const menuItems = await prisma.menu.findMany({
        orderBy: [
            { position: 'asc' },
            { order: 'asc' }
        ]
    });

    const isHindi = locale === 'hi';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'नेविगेशन प्रबंधन' : 'Navigation Management'}
                </h1>
                <p className="dashboard-body text-muted-foreground mt-1">
                    {isHindi ? 'साइट मेनू (हेडर, फुटर, साइडबार) प्रबंधित करें।' : 'Manage site menus (Header, Footer, Sidebar).'}
                </p>
            </div>
            <MenuManager initialItems={menuItems} locale={locale} />
        </div>
    );
}
