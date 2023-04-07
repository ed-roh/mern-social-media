import mongoose from "mongoose";

const savedSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
    saved: {
      type: Map,
      of: Boolean,
    },
  },
  { timestamps: true }
);

const Saved = mongoose.model("Saved", savedSchema);

export default Saved;
