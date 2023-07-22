import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema(
  {
    members:{
        type:Array,
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Conversation", ConversationSchema);

export default Post;
