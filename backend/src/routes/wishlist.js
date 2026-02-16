import express from "express";
import User from "../models/User.js";
import PG from "../models/PG.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/wishlist/:pgId", protect, async (req, res) => {
  const pg = await PG.findById(req.params.pgId);
  if (!pg) {
    return res.status(404).json({ message: "PG not found" });
  }
  const user = await User.findById(req.user._id);
  const exists = user.wishlist.some((id) => id.toString() === pg._id.toString());
  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== pg._id.toString());
  } else {
    user.wishlist.push(pg._id);
  }
  await user.save();
  res.json({ wishlist: user.wishlist });
});

router.get("/wishlist", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist || []);
});

export default router;
