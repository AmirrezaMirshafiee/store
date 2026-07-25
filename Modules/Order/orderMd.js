import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema(
  {
    productId: {
      type: Object,
      required: [true, "productId is required"],
    },
    productVariantId: {
      type: Object,
      required: [true, "productVariantId is required"],
    },
    categoryId: {
      type: Object,
      required: [true, "Category is required"],
    },
    brandId: {
      type: Object,
      required: [true, "brandId is required"],
    },
    quantity: {
      type: Number,
      min: [1, "minimum 1"],
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [itemsSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      min: [0, "minimum 0"],
      required: [true, "totalPrice is required"],
    },
    totalPriceAfterDiscount: {
      type: Number,
      min: [0, "minimum 0"],
      required: [true, "totalPriceAfterDiscount is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    address: {
      type: Object,
      required: [true, "address is required"],
    },
    discountCode: {
      type: Object,
      default: null,
    },
    authority: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
