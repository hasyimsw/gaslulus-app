import { Router } from 'express';
import multer from 'multer';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, getPracticeQuestions, importQuestions } from '../controllers/question.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public/User practice routes
router.get('/practice/:category/:subject', authenticate, getPracticeQuestions);

// Admin routes
router.use(authenticate, authorizeAdmin);
router.get('/', getQuestions);
router.post('/', createQuestion);
router.post('/import/:examId', upload.single('file'), importQuestions);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
