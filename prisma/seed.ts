import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

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
        await prisma.vidhansabha.upsert({
            where: { id: vidhansabhas.indexOf(vs) + 1 },
            update: vs,
            create: vs,
        });
    }
    console.log(`✅ Seeded ${vidhansabhas.length} Vidhansabhas`);

    // Seed Work Types
    const workTypes = [
        { nameHi: 'रोजगार संबंधित', nameEn: 'Employment Related' },
        { nameHi: 'शिक्षा संबंधित', nameEn: 'Education Related' },
        { nameHi: 'स्वास्थ्य संबंधित', nameEn: 'Health Related' },
        { nameHi: 'सड़क/परिवहन', nameEn: 'Road/Transport' },
        { nameHi: 'बिजली/पानी', nameEn: 'Electricity/Water' },
        { nameHi: 'भूमि संबंधित', nameEn: 'Land Related' },
        { nameHi: 'पेंशन संबंधित', nameEn: 'Pension Related' },
        { nameHi: 'आवास संबंधित', nameEn: 'Housing Related' },
        { nameHi: 'सामाजिक सुरक्षा', nameEn: 'Social Security' },
        { nameHi: 'अन्य', nameEn: 'Other' },
    ];

    for (const wt of workTypes) {
        await prisma.workType.upsert({
            where: { id: workTypes.indexOf(wt) + 1 },
            update: wt,
            create: wt,
        });
    }
    console.log(`✅ Seeded ${workTypes.length} Work Types`);

    // Seed Super Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@drkiodilal.in' },
        update: {},
        create: {
            email: 'admin@drkiodilal.in',
            password: hashedPassword,
            name: 'Super Admin',
            role: Role.SUPER_ADMIN,
        },
    });
    console.log('✅ Seeded Super Admin user');

    // Seed Timeline Events
    const timelineEvents = [
        {
            year: 1952,
            titleHi: 'जन्म',
            titleEn: 'Birth',
            descHi: 'राजस्थान के एक गाँव में जन्म',
            descEn: 'Born in a village in Rajasthan',
        },
        {
            year: 1990,
            titleHi: 'राजनीतिक करियर की शुरुआत',
            titleEn: 'Political Career Begins',
            descHi: 'सक्रिय राजनीति में प्रवेश',
            descEn: 'Entered active politics',
        },
        {
            year: 2008,
            titleHi: 'राज्य सभा सदस्य',
            titleEn: 'Rajya Sabha Member',
            descHi: 'राज्य सभा के लिए निर्वाचित',
            descEn: 'Elected to Rajya Sabha',
        },
    ];

    for (const event of timelineEvents) {
        await prisma.timelineEvent.upsert({
            where: { id: timelineEvents.indexOf(event) + 1 },
            update: event,
            create: event,
        });
    }
    console.log(`✅ Seeded ${timelineEvents.length} Timeline Events`);

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
