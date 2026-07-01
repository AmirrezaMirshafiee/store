import mongoose from "mongoose";
const variantSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["size", "color"],
      required: [true, "type is required"],
      index: true,
    },
    value: {
      type: String,
      required: [true, "value is required"],
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
