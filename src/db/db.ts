// Setting up the prisma client
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

// The global prisma variable declaration
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Declaring the prisma database variable
const db = globalThis.prisma ?? prismaClientSingleton()
export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db