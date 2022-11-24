import express from "express";
import { deleteComment, submitComment } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:postId", verifyToken, submitComment);
router.delete("/:postId", verifyToken, deleteComment);
// router.get("/:postId", verifyToken, getComment);

export default router;
