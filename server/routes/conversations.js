import express from "express";
import Conversation from "../models/Conversation.js"
const router = express.Router();
 
// new conversation
router.post("/", async (req, res)=>{
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.receiverId]
    })
    try {
        const savedConvo = await newConversation.save();
        res.status(200).json(savedConvo);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// get conversation
router.get("/", async(req, res)=>{
  try {
    const conversations = await Conversation.find();
    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({message:error.message})
  }  
})

router.get("/:userId", async (req, res)=>{
    try {
        const conversation = await Conversation.find({
            members:{$in:[req.params.userId]}
        })

        res.status(200).json(conversation)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

export default router;