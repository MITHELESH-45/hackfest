import express from 'express';
import {
    submitComplaint,
    getAllComplaints,
    resolveComplaint
} from '../controllers/complaintController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Participant routes
router.post('/', authenticate, authorize('PARTICIPANT'), submitComplaint);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllComplaints);
router.put('/:id/resolve', authenticate, authorize('ADMIN'), resolveComplaint);

export default router;
