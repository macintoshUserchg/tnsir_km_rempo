
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding Movements menu item...');

    // Find current max order in HEADER
    const headerItems = await prisma.menu.findMany({
        where: { position: 'HEADER', parentId: null },
        orderBy: { order: 'desc' },
        take: 1
    });

    const nextOrder = (headerItems[0]?.order || 0) + 1;

    // Check if it already exists
    const existing = await prisma.menu.findFirst({
        where: { url: '/movements' }
    });

    if (existing) {
        console.log('Movements menu item already exists.');
    } else {
        await prisma.menu.create({
            data: {
                labelHi: 'प्रमुख आंदोलन',
                labelEn: 'Major Movements',
                url: '/movements',
                position: 'HEADER',
                order: nextOrder,
                isVisible: true
            }
        });
        console.log('Movements menu item created successfully.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
