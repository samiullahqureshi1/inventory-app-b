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
    default:'true'
  },
  images: [String],
  quantity:{
    type:String,
  },
  price:{
    type:String
  },
  category:{
    type:String
  },
  expiry_date: {
    type: Date, // New field for expiry date
  },
},{
  timestamps:true
});

product_schema.pre('save', function (next) {
  this.in_stock = this.quantity > 0;
  next();
});

const Product = mongoose.model("Product", product_schema);
export { Product };
