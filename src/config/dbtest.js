const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function logCurrentDatabase() {
    const db = await prisma.$queryRaw`SELECT current_database()`;
    console.log('CURRENT DATABASE:', db[0].current_database);
    const result = await prisma.$queryRaw`SELECT current_user, session_user`;
    console.log('🧑‍💻 Connected as:', result);
}

module.exports = { logCurrentDatabase };
