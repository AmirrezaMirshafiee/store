import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "category title is required"],
      unique: [true, "category title is unique"],
      index: true,
    },
    image: {
      type: String,
      required: [true, "category image is required"],
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);
const Category = mongoose.model("Category", categorySchema);
export default Category;
