import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllPGs,
  getAllUsers,
  updateUserRole,
  deleteReview,
  getDashboardStats
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/pgs', getAllPGs);
router.get('/users', getAllUsers);
router.put('/users/:id/role', body('role').isIn(['user', 'owner', 'admin']), updateUserRole);
router.delete('/reviews/:id', deleteReview);

export default router;
