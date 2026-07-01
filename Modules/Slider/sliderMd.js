import mongoose from "mongoose";
const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "slider title is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "slider images is required"],
    },
    path: {
      type: String,
      required: [true, "slider path is required"],
    },
    href: {
      type: String,
      required: [true, "slider href is required"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);
const Slider=mongoose.model("Slider",sliderSchema)
export default Slider