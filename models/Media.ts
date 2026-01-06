import { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
  {
    name: String,
    url: String,
    public_id: String,
  },
  { timestamps: true }
);

export default models.Media || model("Media", MediaSchema);
