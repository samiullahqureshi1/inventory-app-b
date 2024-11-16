import mongoose from "mongoose";

const product_schema = new mongoose.Schema({
  title: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  product_name: {
    type: String,
  },
  discription: {
    type: String,
  },
  in_stock: {
    type: Boolean,
  },
  images: {
    type: Array,
  },
});

const Product = mongoose.model("Product", product_schema);
export { Product };
