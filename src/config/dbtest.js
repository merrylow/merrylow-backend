const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function logCurrentDatabase() {
    const db = await prisma.$queryRaw`SELECT current_database()`;
    console.log('CURRENT DATABASE:', db[0].current_database);
}

module.exports = { logCurrentDatabase };
