import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
  },
  { timestamps: true, versionKey: false },
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
