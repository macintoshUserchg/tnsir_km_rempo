
import 'dotenv/config';
import prisma from '../src/lib/db';
import * as bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@drkirodilal.in';
    const newPassword = 'admin123'; // 8 characters, satisfies min(6)

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`User ${email} not found.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
        },
    });

    console.log(`Updated password for ${email} to: ${newPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
