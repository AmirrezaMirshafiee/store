import mongoose from "mongoose";
const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "brand title is required"],
      unique: [true, "brand title is unique"],
      index: true,
    },
    image: {
      type: String,
      required: [true, "brand image is required"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
