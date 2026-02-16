import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
