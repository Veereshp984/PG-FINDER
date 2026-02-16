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
  await review.deleteOne();
  res.json({ message: "Review removed" });
});

export default router;
