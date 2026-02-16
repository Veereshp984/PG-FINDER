import Review from '../models/Review.js';
import PG from '../models/PG.js';
import { validationResult } from 'express-validator';

export const getReviewsByPG = async (req, res) => {
  try {
    const reviews = await Review.find({ pgId: req.params.pgId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const pgId = req.params.pgId;

    // Check if PG exists
    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    // Check if user already reviewed this PG
    const existingReview = await Review.findOne({
      pgId,
      userId: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this PG' });
    }

    const review = await Review.create({
      pgId,
      userId: req.user.id,
      rating,
      comment
    });

    await review.populate('userId', 'name');

    // Update PG rating
    const reviews = await Review.find({ pgId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await PG.findByIdAndUpdate(pgId, {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('userId', 'name');

    // Update PG rating
    const reviews = await Review.find({ pgId: review.pgId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await PG.findByIdAndUpdate(review.pgId, {
      avgRating: Math.round(avgRating * 10) / 10
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update PG rating
    const reviews = await Review.find({ pgId: review.pgId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await PG.findByIdAndUpdate(review.pgId, {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
