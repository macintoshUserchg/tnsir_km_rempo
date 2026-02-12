import 'dotenv/config';
import prisma from '../src/lib/db';

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                createdAt: true,
                id: true
            }
        });
        console.log(JSON.stringify(users, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
