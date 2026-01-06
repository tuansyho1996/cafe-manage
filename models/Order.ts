import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    tableId: String,
    items: Array,
    total: Number,
    status: { type: String, default: "pending" },
    time: String,
    type: String, // "dine-in" or "takeaway"
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
