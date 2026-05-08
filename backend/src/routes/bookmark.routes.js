import { Router } from 'express';
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmark.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:questionId', removeBookmark);

export default router;
