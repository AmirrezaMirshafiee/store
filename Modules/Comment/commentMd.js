import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "content is required"],
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "productId is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    rate: {
      type: Number,
      min: [1, "Rate must be at least 1"],
      max: [5, "Rate must be at most 5"],
    },
    isBought: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
