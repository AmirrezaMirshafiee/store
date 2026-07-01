import mongoose from "mongoose";
const productVariantSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: [true, "variantId is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "productId is required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      min: [0, "minimum 0"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "minimum 0"],
    },
    discountPercent: {
      type: Number,
      min: [0, "minimum 0"],
      max: [99, "maximum 99"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "minimum 0"],
      validate: {
        validator: function (item) {
          return item < this.price;
        },
        message: "priceAfterDiscount lower than price",
      },
    },
    boughtCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);
productVariantSchema.pre("save", function (next) {
  this.priceAfterDiscount = +(
    this.price *
    (1 - this.discountPercent) / 100
  ).toFixed(2);
  return next()
});
const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;
