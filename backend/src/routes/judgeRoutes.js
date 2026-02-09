import express from 'express';
import {
    getAllJudges,
    createJudge,
    updateJudge,
    deleteJudge
} from '../controllers/judgeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getAllJudges);
router.post('/', authenticate, authorize('ADMIN'), createJudge);
router.put('/:id', authenticate, authorize('ADMIN'), updateJudge);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteJudge);

export default router;
