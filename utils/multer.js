import multer from "multer";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes("create_product")) {
      cb(null, path.join(__dirname, "../public/products"));
    }
  },
  filename: function (req, file, cb) {
    let name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
export const upload = multer({storage:storage})