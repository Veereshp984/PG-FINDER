import express from "express";
import User from "../models/User.js";
import PG from "../models/PG.js";
import Review from "../models/Review.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/pgs", async (req, res) => {
  const pgs = await PG.find().sort({ createdAt: -1 });
  res.json(pgs);
});

router.delete("/pgs/:id", async (req, res) => {
  const pg = await PG.findById(req.params.id);
  if (!pg) {
    return res.status(404).json({ message: "PG not found" });
  }
  await Review.deleteMany({ pgId: pg._id });
  await pg.deleteOne();
  res.json({ message: "PG deleted successfully" });
});

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.put("/users/:id/role", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.role = req.body.role || user.role;
  await user.save();
  res.json({ id: user._id, role: user.role });
});

router.delete("/reviews/:id", async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  const pgId = review.pgId;
  await review.deleteOne();
  
  // Recalculate rating stats
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
  if (pg) {
    pg.avgRating = stats[0]?.avgRating || 0;
    pg.reviewCount = stats[0]?.count || 0;
    await pg.save();
  }
  
  res.json({ message: "Review removed" });
});

export default router;
