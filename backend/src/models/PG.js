import mongoose from "mongoose";

const sharingSchema = new mongoose.Schema(
  {
    type: { type: Number, enum: [1, 2, 3, 4], required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true }
  },
  { _id: false }
);

const pgSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    sharingTypes: [sharingSchema],
    genderAllowed: { type: String, enum: ["male", "female", "unisex"], required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const PG = mongoose.model("PG", pgSchema);
export default PG;
