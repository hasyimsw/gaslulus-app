import { Router } from 'express';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, getPracticeQuestions } from '../controllers/question.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public/User practice routes
router.get('/practice/:category/:subject', authenticate, getPracticeQuestions);

// Admin routes
router.use(authenticate, authorizeAdmin);
router.get('/', getQuestions);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
