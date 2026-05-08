import { Router } from 'express';
import { getHistory, getResultDetail, getDashboardStats, clearHistory } from '../controllers/result.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/dashboard', getDashboardStats);
router.get('/', getHistory);
router.delete('/clear', clearHistory);
router.get('/:id', getResultDetail);

export default router;
