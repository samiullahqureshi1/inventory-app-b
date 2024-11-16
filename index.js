// Express
import express from "express";
const app = express();

// Cors
import cors from "cors";

// DB Function Import
import { db_connection } from "./db/db.js";

// Dotenv
import dotenv from "dotenv";
dotenv.config();

// Import Routes.
import { user_routes } from "./routes/user_routes.js";
import { raw_material_routes } from "./routes/raw_material_routes.js";
import { product_routes } from "./routes/product_routes.js";

// Data Base Connection
db_connection()
  .then(() => {
    console.log(`Server is connected with Data Base`);
  })
  .catch((error) => {
    console.log(error);
  });

// Middlewares
app.use(express.json());
app.use(cors());

// User Route
app.use("/user", user_routes);

// Raw Material Route
app.use("/raw_material", raw_material_routes);

// Product Route
app.use("/product", product_routes)

// Server listening
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
