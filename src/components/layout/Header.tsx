import React from 'react';
import HeaderClient from './HeaderClient';
import { prisma } from '@/lib/db';

export default async function Header() {
    const menuItems = await prisma.menu.findMany({
        where: {
            position: 'HEADER',
            parentId: null,
            isVisible: true,
        },
        include: {
            children: {
                where: { isVisible: true },
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { order: 'asc' },
    });

    return <HeaderClient items={menuItems} />;
}
