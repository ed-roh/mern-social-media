import express from "express";
import Conversation from "../models/Conversation.js"
const router = express.Router();

// new conversation
router.post("/", async (req, res) => {
    const existingConvs = await Conversation.findOne({
        members: { $all: [req.body.senderId, req.body.receiverId] }
    })
    if (existingConvs) {
        return res.status(200).json({ existingConversation: true, _id: existingConvs._id })
    }
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })
    try {
        const savedConvo = await newConversation.save();
        res.status(200).json({ ...savedConvo, existingConversation: false });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// get conversation
router.get("/", async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        })

        res.status(200).json(conversation)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// delete conversation
router.delete("/:userId/:friendId", async (req, res) => {
    const { userId, friendId } = req.params;
    try {
        const dlted = await Conversation.deleteOne({
            members: { $all: [userId, friendId] }
        })
        res.send(dlted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// update conversation
router.put("/:convoId/delete-convo", async (req, res) => {
    const convoId  = req.params.convoId
    try {
        console.log(">>>>>",convoId)
        const dlted = await Conversation.findByIdAndDelete(convoId);
        res.status(200).json({ deleted: true, msg: "conversation deleted successfully", err: false })
    } catch (error) {
        res.status(500).json({ deleted: false, msg: error.message, err: true })
    }
})

router.put("/:convoId/update-check/", async(req, res)=>{
    try {
        const resp = await Conversation.findByIdAndUpdate(req.params.convoId, {checked:true}, {new:true})
        res.status(200).json(resp)
    } catch (error) {
        res.status(500).json({ msg: error.message, err: true })
    }
})

export default router;