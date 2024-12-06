import mongoose from "mongoose";

const raw_schema = new mongoose.Schema({
  title: {
    type: String,
  },
  product_name: {
    type: String,
  },
  category:{
type:String
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
  },
  expiry_date: {
    type: Date, // New field for expiry date
  },
},{
  timestamps:true
});

raw_schema.pre('save', function (next) {
  this.in_stock = this.quantity > 0;
  next();
});

const RawMaterial = mongoose.model("RawMaterial", raw_schema);
export { RawMaterial };
