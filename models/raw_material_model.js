import mongoose from "mongoose";
const raw_material_schema = new mongoose.Schema({
  name: {
    type: String,
  },
  in_stock: {
    type: Number,
    default: 0,
  },
  remaining: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    enum: ["kg", "g", "liters", "ml", "pieces", "meters", "units"],
  },
  expiry_date: {
    type: Date, // New field for expiry date
  },
});

const Raw_Material = mongoose.model("Raw_Material", raw_material_schema);
export { Raw_Material };
