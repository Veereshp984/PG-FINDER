import express from "express";
import { body, validationResult } from "express-validator";
import Inquiry from "../models/Inquiry.js";
import PG from "../models/PG.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.post(
  "/pgs/:id/inquiry",
  [body("name").notEmpty(), body("phone").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }
    const inquiry = await Inquiry.create({
      pgId: pg._id,
      userId: req.user?._id || null,
      name: req.body.name,
      phone: req.body.phone,
      message: req.body.message
    });
    res.status(201).json(inquiry);
  }
);

router.get("/inquiries", protect, requireRole("owner", "admin"), async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { pgId: { $in: await PG.find({ ownerId: req.user._id }).distinct("_id") } };
  const inquiries = await Inquiry.find(filter).populate("pgId", "title location");
  res.json(inquiries);
});

router.put("/inquiries/:id", protect, requireRole("owner", "admin"), async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ message: "Inquiry not found" });
  }
  inquiry.message = req.body.message ?? inquiry.message;
  await inquiry.save();
  res.json(inquiry);
});

export default router;
