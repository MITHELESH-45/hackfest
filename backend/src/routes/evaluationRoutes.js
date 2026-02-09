import express from 'express';
import {
    submitEvaluation,
    getJudgeEvaluations,
    getMyTeamEvaluationStatus,
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

// Participant route (my team's evaluation status per round)
router.get('/my-team', authenticate, authorize('PARTICIPANT'), getMyTeamEvaluationStatus);

// Admin routes
router.get('/team/:teamId', authenticate, authorize('ADMIN'), getTeamEvaluations);
router.get('/all', authenticate, authorize('ADMIN'), getAllEvaluations);

export default router;
