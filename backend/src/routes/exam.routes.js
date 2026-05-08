import { Router } from 'express';
import {
  getExams, getExamById, getExamQuestions, submitExam,
  adminGetExams, createExam, updateExam, deleteExam,
} from '../controllers/exam.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getExams);
router.get('/:id', getExamById);

// Protected routes (require login)
router.get('/:id/questions', authenticate, getExamQuestions);
router.post('/:id/submit', authenticate, submitExam);

// Admin routes
router.get('/admin/all', authenticate, authorizeAdmin, adminGetExams);
router.post('/', authenticate, authorizeAdmin, createExam);
router.put('/:id', authenticate, authorizeAdmin, updateExam);
router.delete('/:id', authenticate, authorizeAdmin, deleteExam);

export default router;
