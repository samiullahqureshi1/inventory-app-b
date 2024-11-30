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
  deleteProduct,
  get_product_Out,
  new_product_raw,
  get_product_raw,
  deleteProductRaw,
  update_product_raw,
  createOrder,
  getOrder,
  getOrderProccessing,
  getPendingOrder,
  deleteOrder,
  updateOrder,
  orderDelivered,
  getWeeklySales,
} from "../controllers/product_controller.js";
const product_routes = express.Router();

product_routes.post("/create_product",upload.array('images'), new_product);
product_routes.post("/create_product_raw",upload.array('images'), new_product_raw);
product_routes.get("/get_product_raw", get_product_raw);
product_routes.get("/get_product", get_product);
product_routes.get("/out", get_product_Out);
product_routes.get("/weeklysales", getWeeklySales);

product_routes.patch("/update_product/:id",upload.array('images'), update_product);
product_routes.patch("/update_product_raw/:id",upload.array('images'), update_product_raw);
product_routes.put('/orderupdate/:id',updateOrder)
product_routes.put('/orderdeliver/:id',orderDelivered)
product_routes.patch("/update_image/:id",upload.array("images"), image_update);
product_routes.delete("/delete_product/:id", delete_product);
product_routes.get('/outofstock',getOutProduct)
product_routes.get('/getorder',getOrder)
product_routes.get('/getorderproccess',getOrderProccessing)
product_routes.get('/getorderpending',getPendingOrder)
product_routes.delete('/:id',deleteProduct)
product_routes.delete('/order/:id',deleteOrder)
product_routes.delete('/raw_product/:id',deleteProductRaw)
product_routes.post('/createorder',createOrder)
export { product_routes };
