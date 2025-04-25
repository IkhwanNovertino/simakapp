
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prismaClientSingleton = globalForPrisma.prisma || new PrismaClient({})

export const prisma = prismaClientSingleton;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma