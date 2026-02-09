import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedAdmin } from './utils/seedAdmin.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Seed admin account
        await seedAdmin();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
