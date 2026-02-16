import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
