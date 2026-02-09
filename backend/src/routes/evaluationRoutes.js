import express from 'express';
import {
    submitEvaluation,
    getJudgeEvaluations,
    getTeamEvaluations,
    getAllEvaluations,
    getLeaderboard
} from '../controllers/evaluationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Judge routes
router.post('/', authenticate, authorize('JUDGE'), submitEvaluation);
router.get('/judge', authenticate, authorize('JUDGE'), getJudgeEvaluations);

// Admin routes
router.get('/team/:teamId', authenticate, authorize('ADMIN'), getTeamEvaluations);
router.get('/all', authenticate, authorize('ADMIN'), getAllEvaluations);

export default router;
