import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      match: [/^(?:\+98|0)?9\d{9}$/, "invalid Phone number"],
      unique: [true, "phone number already exist"],
      required: [true, "phone number is required"],
    },
    fullName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      default:null
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    addressId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratedProductId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    favoriteProductId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    boughtProductId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);
const User = mongoose.model("User", userSchema);
export default User;
