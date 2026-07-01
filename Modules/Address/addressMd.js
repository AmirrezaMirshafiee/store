import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    province: {
      type: String,
      required: [true, "province  is required"],
      index: true,
    },
    city: {
      type: String,
      required: [true, "city  is required"],
    },
    address: {
      type: String,
      required: [true, "city  is required"],
    },
    NO: {
      type: String,
      required: [true, "NO  is required"],
    },
    floor: {
      type: String,
      required: [true, "NO  is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId  is required"],
    },
    postCode: {
      type: String,
      required: [true, "postCode  is required"],
      match: [/\b\d{5}[ -]?\d{5}\b/, "invalid postCode"],
    },
  },
  { timestamps: true, versionKey: false },
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
