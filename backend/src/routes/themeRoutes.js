import express from 'express';
import {
    getAllThemes,
    createTheme,
    updateTheme,
    deleteTheme
} from '../controllers/themeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getAllThemes);
router.post('/', authenticate, authorize('ADMIN'), createTheme);
router.put('/:id', authenticate, authorize('ADMIN'), updateTheme);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTheme);

export default router;
