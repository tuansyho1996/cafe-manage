import { Schema, model, models } from "mongoose";

const TableSchema = new Schema(
  {
    name: String,
    time: String,
    price: Number,
    product: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

export default models.Table || model("Table", TableSchema);
