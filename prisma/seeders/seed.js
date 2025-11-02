import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // insert users
    const password = await bcrypt.hash('password', 10);
    await prisma.user.upsert({
        where: { email: 'harithya77@gmail.com' },
        update: {},
        create: {
            name: 'Harithya Wisesa',
            email: 'harithya77@gmail.com',
            password: password,
        }
    })

    console.log('🌱 Seeding complete');
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });