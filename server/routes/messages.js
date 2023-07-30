import express from "express";
import Message from "../models/Message.js"
import Conversation from '../models/Conversation.js'
const router = express.Router();
 
// add
router.post("/:conversationId", async (req, res)=>{

    try {
        const newMessage = new Message(req.body);
        const updatedConv = await Conversation.findByIdAndUpdate(req.params.conversationId,
            {latestText:req.body.text}, {new:true}
            )
        console.log(updatedConv)
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// get
router.get("/:conversationId", async (req, res)=>{
    try {
        const messages = await Message.find({
            conversationId:req.params.conversationId
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


export default router;