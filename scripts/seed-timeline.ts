
import 'dotenv/config';
import prisma from '../src/lib/db';
import { timelineData } from '../src/data/timeline';

console.log('Database URL:', process.env.DATABASE_URL ? 'Found' : 'Not Found');

async function main() {
    console.log('Start seeding timeline events...');

    for (const event of timelineData) {
        const yearInt = parseInt(event.year);

        const exists = await prisma.timelineEvent.findFirst({
            where: {
                year: yearInt,
                titleEn: event.title,
            }
        });

        if (!exists) {
            await prisma.timelineEvent.create({
                data: {
                    year: yearInt,
                    titleEn: event.title,
                    titleHi: event.titleHi || '',
                    descEn: event.description,
                    descHi: event.descriptionHi || '',
                },
            });
            console.log(`Created event: ${event.title}`);
        } else {
            console.log(`Event already exists: ${event.year} - ${event.title}, updating...`);
            await prisma.timelineEvent.update({
                where: { id: exists.id },
                data: {
                    titleHi: event.titleHi || '',
                    descEn: event.description,
                    descHi: event.descriptionHi || '',
                }
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
