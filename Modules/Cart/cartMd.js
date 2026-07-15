import mongoose from "mongoose";
const itemsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "productId is required"],
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: [true, "productVariantId is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "brandId is required"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "minimum 1"],
    },
  },
  { _id: false },
);
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    items: {
      type: [itemsSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "minimum 0"],
    },
    totalPriceAfterDiscount: {
      type: Number,
      default: 0,
      min: [0, "minimum 0"],
    },
  },
  { timestamps: true, versionKey: false },
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
