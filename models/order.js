import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
});

const order = mongoose.model('Order', orderSchema);
export{order}