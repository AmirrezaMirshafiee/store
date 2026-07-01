import mongoose from "mongoose";
const information = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "key is required"],
    },
    value: {
      type: String,
      required: [true, "value is required"],
    },
  },
  { _id: false },
);
const productSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "brandId is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    defaultProductVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    productVariants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" }],
      default: [],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    ratingCount: {
      type: Number,
      default: 0,
      max: 5,
      min: 1,
    },
    avgRate: {
      type: Number,
      default: 0,
      max: 5,
      min: 0,
    },
    information: {
      type: [information],
      default: [],
    },
    images: {
      type: [String],
      required: [true, "images is required"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    boughtCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
