import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    tableId: String,
    items: Array,
    total: Number,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
