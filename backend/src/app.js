import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import judgeRoutes from './routes/judgeRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathon', hackathonRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/judges', judgeRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/complaints', complaintRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
