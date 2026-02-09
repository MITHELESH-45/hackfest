import express from 'express';
import { login, changePassword, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', login);

// Protected routes
router.post('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);

export default router;
