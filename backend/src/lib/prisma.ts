import { PrismaClient } from '@prisma/client';

// Deklarasi global untuk menyimpan instance PrismaClient
// agar tidak membuat koneksi baru di setiap hot-reload saat development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
