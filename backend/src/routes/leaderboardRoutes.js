import express from 'express';
import { getLeaderboard } from '../controllers/evaluationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Leaderboard - Admin only
router.get('/', authenticate, authorize('ADMIN'), getLeaderboard);

export default router;
