import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlist.controller.js';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/:pgId', protect, addToWishlist);
router.delete('/:pgId', protect, removeFromWishlist);

export default router;
