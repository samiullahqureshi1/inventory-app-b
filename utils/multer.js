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
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dqywiw0x2", // Replace with your Cloudinary cloud name
  api_key: "866915634377984", // Replace with your Cloudinary API key
  api_secret: "a51fvdWRJT1Riam63nkcmzj6KW8", // Replace with your Cloudinary API secret
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "public/products", // Folder in Cloudinary where files will be uploaded
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
  },
});

// Configure Multer
export const upload = multer({ storage: storage });
