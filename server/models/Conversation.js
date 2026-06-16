import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema(
  {
    members:{
        type:Array,
    },
    latestText:{
      type:String,
      default:''
    },
    checked:{
      type:Boolean
    },
    senderId:{
      type:String
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Conversation", ConversationSchema);

export default Post;
