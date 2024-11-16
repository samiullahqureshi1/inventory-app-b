import express from "express";
const user_routes = express.Router();

// Import Functions
import { Signup, Login } from "../controllers/user_controller.js";

user_routes.post("/signup", Signup);
user_routes.post("/login", Login);

export { user_routes };
