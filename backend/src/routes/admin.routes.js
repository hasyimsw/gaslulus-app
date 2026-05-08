import { Router } from 'express';
import { getUsers, getStats, deleteUser } from '../controllers/admin.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorizeAdmin);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:uuid', deleteUser);

export default router;
