import express from "express";
const user_routes = express.Router();

// Import Functions
import { signUp, signIn } from "../controllers/user_controller.js";

user_routes.post("/signup", signUp);
user_routes.post("/login", signIn);

export { user_routes };
