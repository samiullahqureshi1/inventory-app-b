import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  customerName:{type:String},
  customerEmail:{type:String},
  customerPhone:{type:Number},
  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Cancelled",'Delivered'],
    default: "Pending",
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const order = mongoose.model("Order", orderSchema);

export { order };
