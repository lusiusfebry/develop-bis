import { Router } from 'express';
import { login, logout, me } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Route publik
router.post('/login', login);

// Route yang memerlukan autentikasi
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
