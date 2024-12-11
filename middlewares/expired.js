import cron from "node-cron";
import { Product } from "../models/product_model.js";

export const startProductExpiryCron = () => {
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();
    try {
      await Product.updateMany(
        { expiry_date: { $lt: today } },
        { $set: { in_stock: false } }
      );
      console.log("Expired products updated.");
    } catch (error) {
      console.error("Error updating expired products:", error);
    }
  });
  console.log("Product expiry cron job scheduled.");
};
