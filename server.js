const app = require('./app');
const dotenv = require('dotenv');
const prisma = require('./prismaClient'); 
const PORT = process.env.PORT || 5000;

dotenv.config();

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Optional: Test database connection this way, If the database is down, the server startup can fail early instead of breaking when a request is made.
    try {
        await prisma.$connect();
        console.log(" Connected to database successfully");
    } catch (error) {
        console.error(" Failed to connect to database:", error);
    }
});
