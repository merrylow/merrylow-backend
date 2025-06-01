const app = require('./app');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const { logCurrentDatabase } = require('./src/config/dbtest');

dotenv.config();

app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);

    try {
        if (process.env.NODE_ENV === 'production') {
            logCurrentDatabase();
        } else {
            console.log('Currently on local...');
        }
        await prisma.$connect();
        console.log(' Connected to database successfully');
    } catch (error) {
        console.error(' Failed to connect to database:', error);
    }
});
