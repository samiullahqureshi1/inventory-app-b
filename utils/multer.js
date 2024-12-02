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

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use a valid relative path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filenames
  },
});

// Initialize multer with storage configuration
export const upload = multer({ storage });
