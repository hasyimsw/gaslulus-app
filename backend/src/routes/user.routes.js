import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

export default router;
