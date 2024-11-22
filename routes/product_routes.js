import express from "express";
// Import multer function
import { upload } from "../utils/multer.js";

// Import Function
import {
  new_product,
  get_product,
  update_product,
  delete_product,
  image_update,
  getOutProduct,
  deleteProduct
} from "../controllers/product_controller.js";
const product_routes = express.Router();

product_routes.post("/create_product",upload.single('images'), new_product);
product_routes.get("/get_product", get_product);
product_routes.patch("/update_product/:id", update_product);
product_routes.patch("/update_image/:id",upload.array("images"), image_update);
product_routes.delete("/delete_product/:id", delete_product);
product_routes.get('/outofstock',getOutProduct)
product_routes.delete('/:id',deleteProduct)
export { product_routes };
