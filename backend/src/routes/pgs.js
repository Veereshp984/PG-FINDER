import express from "express";
import { body, validationResult } from "express-validator";
import PG from "../models/PG.js";
import Review from "../models/Review.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { upload, uploadToCloudinary } from "../utils/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { sharing, minPrice, maxPrice, gender, city, rating, q } = req.query;
  const query = { isActive: true };
  if (gender) {
    query.genderAllowed = gender;
  }
  if (city) {
    query["location.city"] = city;
  }
  if (rating) {
    query.avgRating = { $gte: Number(rating) };
  }
  if (q) {
    query.title = { $regex: q, $options: "i" };
  }
  if (sharing || minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    query.sharingTypes = {
      $elemMatch: {
        ...(sharing ? { type: Number(sharing) } : {}),
        ...(Object.keys(priceFilter).length ? { price: priceFilter } : {})
      }
    };
  }
  const pgs = await PG.find(query).sort({ createdAt: -1 });
  res.json(pgs);
});

router.get("/my-listings", protect, requireRole("owner", "admin"), async (req, res) => {
  const pgs = await PG.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  res.json(pgs);
});

router.get("/:id", async (req, res) => {
  const pg = await PG.findById(req.params.id).populate("ownerId", "name email phone");
  if (!pg) {
    return res.status(404).json({ message: "PG not found" });
  }
  res.json(pg);
});

router.post(
  "/",
  protect,
  requireRole("owner", "admin"),
  upload.array("photos", 10),
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("genderAllowed").notEmpty(),
    body("location.address").notEmpty(),
    body("location.city").notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const photoUrls = req.files?.length ? await uploadToCloudinary(req.files) : [];
    const payload = {
      ...req.body,
      photos: [...photoUrls, ...(req.body.photos || [])],
      ownerId: req.user._id
    };
    if (typeof payload.sharingTypes === "string") {
      payload.sharingTypes = JSON.parse(payload.sharingTypes);
    }
    if (typeof payload.amenities === "string") {
      payload.amenities = JSON.parse(payload.amenities);
    }
    const pg = await PG.create(payload);
    res.status(201).json(pg);
  }
);

router.put(
  "/:id",
  protect,
  requireRole("owner", "admin"),
  upload.array("photos", 10),
  async (req, res) => {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }
    if (req.user.role !== "admin" && pg.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const newPhotos = req.files?.length ? await uploadToCloudinary(req.files) : [];
    const updates = { ...req.body };
    if (typeof updates.sharingTypes === "string") {
      updates.sharingTypes = JSON.parse(updates.sharingTypes);
    }
    if (typeof updates.amenities === "string") {
      updates.amenities = JSON.parse(updates.amenities);
    }
    updates.photos = [...(pg.photos || []), ...newPhotos];
    const updated = await PG.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  }
);

router.delete("/:id", protect, requireRole("owner", "admin"), async (req, res) => {
  const pg = await PG.findById(req.params.id);
  if (!pg) {
    return res.status(404).json({ message: "PG not found" });
  }
  if (req.user.role !== "admin" && pg.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await Review.deleteMany({ pgId: pg._id });
  await pg.deleteOne();
  res.json({ message: "PG removed" });
});

export default router;
