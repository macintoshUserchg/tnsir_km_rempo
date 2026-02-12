
import 'dotenv/config';
import prisma from '../src/lib/db';
import * as bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@drkirodilal.in';
    const password = 'admin'; // Default password
    const name = 'Admin User';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'SUPER_ADMIN',
        },
    });

    console.log(`Created admin user:`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
