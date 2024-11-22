import mongoose from "mongoose";

const product_schema = new mongoose.Schema({
  title: {
    type: String,
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
  images: [String],
  quantity:{
    type:String,
  },
  price:{
    type:String
  }
});

const Product = mongoose.model("Product", product_schema);
export { Product };
