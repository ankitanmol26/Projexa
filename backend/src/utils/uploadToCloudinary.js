import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * Upload a file buffer to Cloudinary and return the secure URL.
 * @param {Buffer} buffer        - File buffer from multer memory storage
 * @param {string} folder        - Cloudinary folder name
 * @param {object} options       - Additional Cloudinary upload options
 * @returns {Promise<object>}    - Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = "projexa", options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // Default to auto instead of hardcoded 'image' to support PDFs
        // Remove hardcoded allowed_formats so it relies on Cloudinary's auto detection or options override
        max_bytes: 5 * 1024 * 1024, // 5 MB limit
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default uploadToCloudinary;
