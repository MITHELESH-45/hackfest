import express from 'express';
import {
    getConfig,
    updateConfig,
    getTimeline,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    getStats
} from '../controllers/hackathonController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Config routes
router.get('/config', authenticate, getConfig);
router.put('/config', authenticate, authorize('ADMIN'), updateConfig);

// Timeline routes
router.get('/timeline', authenticate, getTimeline);
router.post('/timeline', authenticate, authorize('ADMIN'), addTimelineEvent);
router.put('/timeline/:id', authenticate, authorize('ADMIN'), updateTimelineEvent);
router.delete('/timeline/:id', authenticate, authorize('ADMIN'), deleteTimelineEvent);

// Stats routes
router.get('/stats', authenticate, authorize('ADMIN'), getStats);

export default router;
