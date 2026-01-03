import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    image: String,
    category: String,
    public_id: String,
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
