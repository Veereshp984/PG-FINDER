import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = async (files = []) => {
  const uploads = files.map((file) =>
    cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`)
  );
  const results = await Promise.all(uploads);
  return results.map((result) => result.secure_url);
};
