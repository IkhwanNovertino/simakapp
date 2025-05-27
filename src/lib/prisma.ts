
import { PrismaClient } from '@prisma/client'
import logger from './logger';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prismaClientSingleton: any = globalForPrisma.prisma || new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
    
  ]
})

// prismaClientSingleton.$on('query', (e: any) => {
//   // console.log(e);
// })
// prismaClientSingleton.$on('info', (e: any) => {
//   // console.log(e);
// })
prismaClientSingleton.$on('warn', (e: any) => {
  logger.warn(e);
})
prismaClientSingleton.$on('error', (e: any) => {
  // console.error(e);
  logger.error(e);
})

export const prisma = prismaClientSingleton;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;