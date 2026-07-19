import mongoose from "mongoose";
const discountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "discount code is required"],
      unique: [true, "discount code is unique"],
      trim: true,
    },
    maxPrice: {
      type: Number,
    },
    minPrice: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (end) {
          if (!end || !this.startDate) return true;
          return end >= this.startDate;
        },
        message: "endDate is not valid",
      },
    },
    type: {
      type: String,
      enum: ["percent", "amount", "freeDelivery"],
      required: [true, "type is required"],
    },
    value: {
      type: String,
      required: [true, "value is required"],
      trim: true,
    },
    usedUserId: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    maxUsedUser: {
      type: Number,
      default: 1,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);
const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
export default DiscountCode;
