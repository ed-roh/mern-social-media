import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
    ],
    comments: [
      {
        user: {
          userId: {
            type: String,
          },
          picturePath: {
            type: String,
          },
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
