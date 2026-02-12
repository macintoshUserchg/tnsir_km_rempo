import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
    connectionString,
    ssl: true,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Local Enum definitions to bypass type issues
const SettingType = {
    TEXT: 'TEXT',
    RICHTEXT: 'RICHTEXT',
    IMAGE: 'IMAGE',
    BOOLEAN: 'BOOLEAN'
} as const;

const SettingGroup = {
    GENERAL: 'GENERAL',
    HERO: 'HERO',
    CONTACT: 'CONTACT',
    SOCIAL: 'SOCIAL',
    SEO: 'SEO'
} as const;

const SectionType = {
    HERO: 'HERO',
    RICHTEXT: 'RICHTEXT',
    TIMELINE: 'TIMELINE',
    GALLERY: 'GALLERY',
    VIDEOS: 'VIDEOS',
    CONTACT_FORM: 'CONTACT_FORM',
    FEATURES: 'FEATURES',
    TESTIMONIALS: 'TESTIMONIALS',
    FAQ: 'FAQ'
} as const;

async function main() {
    console.log('🌱 Starting database seed...');

    // Seed Vidhansabhas (Vidhan Sabha constituencies)
    const vidhansabhas = [
        { nameHi: 'सवाई माधोपुर', nameEn: 'Sawai Madhopur' },
        { nameHi: 'गंगापुर सिटी', nameEn: 'Gangapur City' },
        { nameHi: 'बया', nameEn: 'Bayana' },
        { nameHi: 'करौली', nameEn: 'Karauli' },
        { nameHi: 'हिंडौन', nameEn: 'Hindaun' },
        { nameHi: 'टोंक', nameEn: 'Tonk' },
        { nameHi: 'मालपुरा', nameEn: 'Malpura' },
        { nameHi: 'निवाई', nameEn: 'Niwai' },
        { nameHi: 'दौसा', nameEn: 'Dausa' },
        { nameHi: 'लालसोट', nameEn: 'Lalsot' },
    ];

    for (const vs of vidhansabhas) {
        // @ts-ignore
        await prisma.vidhansabha.upsert({
            where: { id: vidhansabhas.indexOf(vs) + 1 },
            update: vs,
            create: vs,
        });
    }
    console.log(`✅ Seeded ${vidhansabhas.length} Vidhansabhas`);

    // Seed Site Settings
    const settings = [
        { key: 'hero_title_hi', value: ' जनसेवक - डॉ. किरोड़ी लाल मीणा', type: SettingType.TEXT, group: SettingGroup.HERO },
        { key: 'hero_title_en', value: 'Public Servant - Dr. Kirodi Lal Meena', type: SettingType.TEXT, group: SettingGroup.HERO },
        { key: 'hero_desc_hi', value: 'सवाई माधोपुर, राजस्थान के समर्पित विधायक। जन-जन की आवाज और विकास के प्रतीक।', type: SettingType.TEXT, group: SettingGroup.HERO },
        { key: 'hero_desc_en', value: 'Dedicated MLA of Sawai Madhopur, Rajasthan. The voice of the people and a symbol of development.', type: SettingType.TEXT, group: SettingGroup.HERO },
        { key: 'contact_email', value: 'contact@drkirodilal.in', type: SettingType.TEXT, group: SettingGroup.CONTACT },
        { key: 'contact_phone', value: '+91 94140 00000', type: SettingType.TEXT, group: SettingGroup.CONTACT },
        { key: 'contact_address_hi', value: 'विधायक आवास, सवाई माधोपुर, राजस्थान', type: SettingType.TEXT, group: SettingGroup.CONTACT },
        { key: 'contact_address_en', value: 'MLA Residence, Sawai Madhopur, Rajasthan', type: SettingType.TEXT, group: SettingGroup.CONTACT },
        { key: 'social_facebook', value: 'https://facebook.com/drkirodilal', type: SettingType.TEXT, group: SettingGroup.SOCIAL },
        { key: 'social_twitter', value: 'https://twitter.com/DrKirodilalBJP', type: SettingType.TEXT, group: SettingGroup.SOCIAL },
        { key: 'social_instagram', value: 'https://instagram.com/drkirodilal', type: SettingType.TEXT, group: SettingGroup.SOCIAL },
        { key: 'social_youtube', value: 'https://youtube.com/@drkirodilalmeena', type: SettingType.TEXT, group: SettingGroup.SOCIAL },
        { key: 'site_copyright', value: '© 2024 Dr. Kirodi Lal Meena. All Rights Reserved.', type: SettingType.TEXT, group: SettingGroup.GENERAL },

        // Typography Defaults
        { key: 'typo_site_base_size', value: '16', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_site_body_weight', value: '400', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_header_nav_size', value: '14', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_header_nav_weight', value: '500', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_footer_title_size', value: '18', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_footer_body_size', value: '14', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_hero_title_size', value: '48', type: SettingType.TEXT, group: SettingGroup.GENERAL },
        { key: 'typo_hero_desc_size', value: '18', type: SettingType.TEXT, group: SettingGroup.GENERAL },
    ];

    for (const s of settings) {
        await prisma.siteSetting.upsert({
            where: { key: s.key },
            update: s,
            create: s,
        });
    }
    console.log(`✅ Seeded ${settings.length} Site Settings`);

    // Seed Pages
    const pages = [
        {
            slug: 'home',
            titleHi: 'होम',
            titleEn: 'Home',
            isPublished: true,
            sections: {
                create: [
                    { type: SectionType.HERO, order: 0, content: { titleHi: 'Hero Section', show: true } },
                    { type: SectionType.FEATURES, order: 1, content: { titleHi: 'Features', items: [] } },
                ]
            }
        },
        {
            slug: 'biography',
            titleHi: 'जीवन परिचय',
            titleEn: 'Biography',
            isPublished: true,
            sections: {
                create: [
                    { type: SectionType.RICHTEXT, order: 0, content: { htmlHi: '<h2>जीवन परिचय</h2><p>विस्तृत जीवनी यहाँ आएगी...</p>', htmlEn: '<h2>Biography</h2><p>Biography content goes here...</p>' } }
                ]
            }
        },
        {
            slug: 'journey',
            titleHi: 'मेरी यात्रा',
            titleEn: 'My Journey',
            isPublished: true,
            sections: {
                create: [
                    { type: SectionType.TIMELINE, order: 0, content: { show: true } }
                ]
            }
        }
    ];

    for (const p of pages) {
        // @ts-ignore
        await prisma.page.upsert({
            where: { slug: p.slug },
            update: {},
            create: p,
        });
    }
    console.log(`✅ Seeded ${pages.length} Pages`);

    // Seed Menus (Recursive structure)
    // First clean up existing header menus to avoid duplicates (optional, or just skipping if exists)
    // For simplicity, we'll check if any header menu exists
    const existingHeader = await prisma.menu.findFirst({ where: { position: 'HEADER' } });

    if (!existingHeader) {
        console.log('🌱 Seeding Header Menu...');

        // 1. Home
        await prisma.menu.create({
            data: { labelHi: 'होम', labelEn: 'Home', url: '/', order: 0, position: 'HEADER' }
        });

        // 2. Biography
        await prisma.menu.create({
            data: { labelHi: 'जीवन परिचय', labelEn: 'Biography', url: '/biography', order: 1, position: 'HEADER' }
        });

        // 3. Speeches
        await prisma.menu.create({
            data: { labelHi: 'भाषण', labelEn: 'Speeches', url: '/speeches', order: 2, position: 'HEADER' }
        });

        // 4. Events
        await prisma.menu.create({
            data: { labelHi: 'कार्यक्रम', labelEn: 'Events', url: '/events', order: 3, position: 'HEADER' }
        });

        // 5. Gallery (Parent)
        const gallery = await prisma.menu.create({
            data: { labelHi: 'गैलरी', labelEn: 'Gallery', url: '#', order: 4, position: 'HEADER' }
        });

        // Gallery Children
        await prisma.menu.create({
            data: { labelHi: 'फोटो गैलरी', labelEn: 'Photo Gallery', url: '/photo-gallery', order: 0, position: 'HEADER', parentId: gallery.id }
        });
        await prisma.menu.create({
            data: { labelHi: 'वीडियो गैलरी', labelEn: 'Video Gallery', url: '/video-gallery', order: 1, position: 'HEADER', parentId: gallery.id }
        });
        await prisma.menu.create({
            data: { labelHi: 'मीडिया कवरेज', labelEn: 'Media Coverage', url: '/media-coverage', order: 2, position: 'HEADER', parentId: gallery.id }
        });

        // 6. Press Release
        await prisma.menu.create({
            data: { labelHi: 'प्रेस विज्ञप्ति', labelEn: 'Press Release', url: '/press-release', order: 5, position: 'HEADER' }
        });

        // 7. Blog
        await prisma.menu.create({
            data: { labelHi: 'ब्लॉग', labelEn: 'Blog', url: '/blog', order: 6, position: 'HEADER' }
        });

        // 8. Contact
        await prisma.menu.create({
            data: { labelHi: 'संपर्क', labelEn: 'Contact', url: '/contact', order: 7, position: 'HEADER' }
        });

        console.log('✅ Seeded Header Menu');
    } else {
        console.log('ℹ️ Header Menu already exists, skipping seed.');
        // Ideally we would update items here but it's complex with nested relations
    }

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@drkirodilal.in';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            name: 'Super Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
        create: {
            email: adminEmail,
            name: 'Super Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log(`✅ Seeded Admin User: ${adminUser.email}`);

    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
