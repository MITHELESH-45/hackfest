import express from 'express';
import {
    getAllTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    toggleReadiness
} from '../controllers/teamController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getAllTeams);
router.post('/', authenticate, authorize('ADMIN'), createTeam);
router.put('/:id', authenticate, authorize('ADMIN'), updateTeam);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTeam);
router.post('/:id/ready', authenticate, authorize('ADMIN', 'PARTICIPANT'), toggleReadiness);

export default router;
