import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus
} from '../controllers/inquiry.controller.js';

const router = express.Router();

router.post(
  '/pg/:pgId',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  createInquiry
);

router.get('/', protect, authorize('owner', 'admin'), getInquiries);
router.put('/:id', protect, authorize('owner', 'admin'), updateInquiryStatus);

export default router;
