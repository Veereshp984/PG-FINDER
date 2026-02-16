import express from 'express';
import { body } from 'express-validator';
import {
  getReviewsByPG,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/pg/:pgId', getReviewsByPG);

router.post(
  '/pg/:pgId',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required')
  ],
  createReview
);

router.put(
  '/:id',
  protect,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty')
  ],
  updateReview
);

router.delete('/:id', protect, deleteReview);

export default router;
