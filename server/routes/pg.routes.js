import express from 'express';
import { body } from 'express-validator';
import {
  getPGs,
  getPGById,
  createPG,
  updatePG,
  deletePG,
  getMyListings,
  removePhoto
} from '../controllers/pg.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getPGs);
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyListings);
router.get('/:id', getPGById);

router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  upload.array('photos', 10),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('sharingTypes').isArray({ min: 1 }).withMessage('At least one sharing type is required'),
    body('genderAllowed').isIn(['male', 'female', 'unisex']).withMessage('Valid gender is required'),
    body('location.address').trim().notEmpty().withMessage('Address is required'),
    body('location.city').trim().notEmpty().withMessage('City is required'),
    body('location.coordinates.lat').isNumeric().withMessage('Valid latitude is required'),
    body('location.coordinates.lng').isNumeric().withMessage('Valid longitude is required')
  ],
  createPG
);

router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  upload.array('photos', 10),
  updatePG
);

router.delete('/:id', protect, authorize('owner', 'admin'), deletePG);
router.put('/:id/remove-photo', protect, authorize('owner', 'admin'), removePhoto);

export default router;
