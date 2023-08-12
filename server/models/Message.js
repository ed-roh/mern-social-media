import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    conversationId:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String
    },
    seen:{
      type:Boolean
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Message", MessageSchema);

export default Post;
