import mongoose from "mongoose";
const productVariantSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: [true, "variantId is required"],
    }
  },
  { timestamps: true, versionKey: false },
);

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;
