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
  async (req, res) => {
    try {
      const photoUrls = req.files?.length ? await uploadToCloudinary(req.files) : [];
      
      // Parse location from JSON string
      let location = req.body.location;
      if (typeof location === "string") {
        location = JSON.parse(location);
      }

      // Parse sharingTypes from JSON string
      let sharingTypes = req.body.sharingTypes;
      if (typeof sharingTypes === "string") {
        sharingTypes = JSON.parse(sharingTypes);
      }

      // Parse amenities from JSON string
      let amenities = req.body.amenities;
      if (typeof amenities === "string") {
        amenities = JSON.parse(amenities);
      }

      const payload = {
        title: req.body.title,
        description: req.body.description,
        genderAllowed: req.body.genderAllowed,
        location,
        sharingTypes,
        amenities,
        photos: photoUrls,
        ownerId: req.user._id
      };

      const pg = await PG.create(payload);
      res.status(201).json(pg);
    } catch (error) {
      console.error("Error creating PG:", error);
      res.status(400).json({ message: error.message || "Failed to create PG listing" });
    }
  }
);

router.put(
  "/:id",
  protect,
  requireRole("owner", "admin"),
  upload.array("photos", 10),
  async (req, res) => {
    try {
      const pg = await PG.findById(req.params.id);
      if (!pg) {
        return res.status(404).json({ message: "PG not found" });
      }
      if (req.user.role !== "admin" && pg.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const newPhotos = req.files?.length ? await uploadToCloudinary(req.files) : [];
      
      // Parse location from JSON string
      let location = req.body.location;
      if (typeof location === "string") {
        location = JSON.parse(location);
      }

      // Parse sharingTypes from JSON string
      let sharingTypes = req.body.sharingTypes;
      if (typeof sharingTypes === "string") {
        sharingTypes = JSON.parse(sharingTypes);
      }

      // Parse amenities from JSON string
      let amenities = req.body.amenities;
      if (typeof amenities === "string") {
        amenities = JSON.parse(amenities);
      }

      const updates = {
        title: req.body.title,
        description: req.body.description,
        genderAllowed: req.body.genderAllowed,
        location,
        sharingTypes,
        amenities,
        photos: [...(pg.photos || []), ...newPhotos]
      };

      const updated = await PG.findByIdAndUpdate(req.params.id, updates, { new: true });
      res.json(updated);
    } catch (error) {
      console.error("Error updating PG:", error);
      res.status(400).json({ message: error.message || "Failed to update PG listing" });
    }
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
