import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { galleryImages } from '../src/data/gallery';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('Starting gallery seeding...');

    // 1. Group images by category to create albums
    const categories = Array.from(new Set(galleryImages.map(img => img.category)));

    // Map categories to user-friendly titles
    const categoryMap: Record<string, { hi: string, en: string }> = {
        'political-events': { hi: 'राजनीतिक कार्यक्रम', en: 'Political Events' },
        'with-leaders': { hi: 'नेताओं के साथ', en: 'With Leaders' },
        'other': { hi: 'अन्य', en: 'Other' }
    };

    for (const cat of categories) {
        const title = categoryMap[cat] || { hi: cat, en: cat };

        console.log(`Creating album: ${title.en}`);

        const catImages = galleryImages.filter(img => img.category === cat);

        // Use the first image as cover image
        const coverImage = catImages[0]?.url || null;

        const album = await prisma.galleryAlbum.create({
            data: {
                titleHi: title.hi,
                titleEn: title.en,
                coverImage,
                description: `Album for ${title.en}`,
                photos: {
                    create: catImages.map((img, idx) => ({
                        imageUrl: img.url,
                        captionHi: img.titleHi || img.title,
                        captionEn: img.title,
                        order: idx
                    }))
                }
            }
        });

        console.log(`Created album ${album.id} with ${catImages.length} photos.`);
    }

    console.log('Gallery seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
