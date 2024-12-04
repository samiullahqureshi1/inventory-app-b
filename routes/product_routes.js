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
  getAllOrders,
  getMonthlySales,
  getTotalOrders,
  getAllSales,
  getTotalRaw,
  getTotalInventory,
  addEmployee,
  getAllEmployee,
  deleteEmployee,
  
} from "../controllers/product_controller.js";
const product_routes = express.Router();

product_routes.post("/create_product",upload.array('images',10), new_product);
product_routes.post("/create_product_raw",upload.array('images',10), new_product_raw);
product_routes.get("/get_product_raw", get_product_raw);
product_routes.post('/postemployee',addEmployee)
product_routes.get("/get_product", get_product);
product_routes.get("/out", get_product_Out);
product_routes.get("/weeklysales", getWeeklySales);
product_routes.get("/getEmployee", getAllEmployee);
product_routes.get("/getAllSales", getAllOrders);
product_routes.get("/getMonthlySales", getMonthlySales);
product_routes.patch("/update_product/:id",upload.array('images',10), update_product);
product_routes.patch("/update_product_raw/:id",upload.array('images',10), update_product_raw);
product_routes.put('/orderupdate/:id',updateOrder)
product_routes.put('/orderdeliver/:id',orderDelivered)
product_routes.patch("/update_image/:id",upload.array("images"), image_update);
product_routes.delete("/delete_product/:id", delete_product);
product_routes.get('/outofstock',getOutProduct)
product_routes.get('/getorder',getOrder)
product_routes.get('/getorderproccess',getOrderProccessing)
product_routes.get('/getorderpending',getPendingOrder)
product_routes.get('/getTotalOrders',getTotalOrders)
product_routes.get('/getAllSlaes',getAllSales)
product_routes.get('/getAllRawMaterial',getTotalRaw)
product_routes.get('/getTotalInventory',getTotalInventory)
product_routes.delete('/:id',deleteProduct)
product_routes.delete('/order/:id',deleteOrder)
product_routes.delete('/raw_product/:id',deleteProductRaw)
product_routes.delete('/deleteEmployee/:id',deleteEmployee)
product_routes.post('/createorder',createOrder)
export { product_routes };
