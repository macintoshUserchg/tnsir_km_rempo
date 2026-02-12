
import 'dotenv/config';
import prisma from '../src/lib/db';
import * as bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@drkirodilal.in';
    const password = 'admin123';

    console.log(`Testing login for: ${email} with password: ${password}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User not found in database.');
        return;
    }

    console.log('✅ User found:', user.email);
    console.log('Stored Hash:', user.password);

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        console.log('✅ Password matches! Login should work.');
    } else {
        console.log('❌ Password DOES NOT match.');

        // Debug: Hash the password again to see what it looks like
        const newHash = await bcrypt.hash(password, 10);
        console.log('New Hash would be:', newHash);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
