import express from "express";
const raw_material_routes = express.Router();

// Import Functions
import {
  new_data,
  get_data,
  update_data,
  delete_data,
} from "../controllers/raw_material_controller.js";

// Raw Material Routes
raw_material_routes.post("/new_data", new_data);
raw_material_routes.get("/get_data", get_data);
raw_material_routes.patch("/update_data/:id", update_data);
raw_material_routes.delete("/delete_data/:id", delete_data);

export { raw_material_routes };
