const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * Uploads a file buffer (from multer memoryStorage) to Cloudinary.
 * Resumes are uploaded as 'raw' resource type since they're PDFs/docs, not images.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadToCloudinary = (buffer, folder = "ats/resumes") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = uploadToCloudinary;
