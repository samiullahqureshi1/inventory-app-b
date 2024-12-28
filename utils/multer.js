// import multer from "multer";
// import path from "path";

// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename)


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (req.originalUrl.includes("create_product")) {
//       cb(null, path.join(__dirname, "../public/products"));
//     }
//   },
//   filename: function (req, file, cb) {
//     let name = Date.now() + "-" + file.originalname;
//     cb(null, name);
//   },
// });
// export const upload = multer({storage:storage})

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dqywiw0x2',
  api_key: '866915634377984',
  api_secret: 'a51fvdWRJT1Riam63nkcmzj6KW8',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Memory Storage
const storage = multer.memoryStorage();

export const upload = multer({ storage });

// Function to Handle Uploads to Cloudinary
export const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "products" }, // Optional folder name in Cloudinary
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url); // Cloudinary's secure URL
        }
      }
    ).end(file.buffer); // Use buffer for direct upload
  });
};
