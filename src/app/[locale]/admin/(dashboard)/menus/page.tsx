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

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Navigation Management</h1>
                <p className="text-muted-foreground">
                    Manage site menus (Header, Footer, Sidebar).
                </p>
            </div>
            <MenuManager initialItems={menuItems} />
        </div>
    );
}
