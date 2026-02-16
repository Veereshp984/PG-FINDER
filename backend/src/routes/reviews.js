import express from "express";
import { body, validationResult } from "express-validator";
import Review from "../models/Review.js";
import PG from "../models/PG.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/pgs/:id/reviews", async (req, res) => {
  const reviews = await Review.find({ pgId: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

router.post(
  "/pgs/:id/reviews",
  protect,
  [body("rating").isInt({ min: 1, max: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }
    const review = await Review.create({
      pgId: pg._id,
      userId: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    const stats = await Review.aggregate([
      { $match: { pgId: pg._id } },
      {
        $group: {
          _id: "$pgId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);
    if (stats[0]) {
      pg.avgRating = stats[0].avgRating;
      pg.reviewCount = stats[0].count;
      await pg.save();
    }
    res.status(201).json(review);
  }
);

const recalcStats = async (pgId) => {
  const stats = await Review.aggregate([
    { $match: { pgId } },
    {
      $group: {
        _id: "$pgId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);
  const pg = await PG.findById(pgId);
  if (!pg) {
    return;
  }
  pg.avgRating = stats[0]?.avgRating || 0;
  pg.reviewCount = stats[0]?.count || 0;
  await pg.save();
};

router.put("/reviews/:id", protect, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  if (review.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }
  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  await review.save();
  await recalcStats(review.pgId);
  res.json(review);
});

router.delete("/reviews/:id", protect, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const pgId = review.pgId;
  await review.deleteOne();
  await recalcStats(pgId);
  res.json({ message: "Review removed" });
});

export default router;
