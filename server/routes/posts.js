import express from "express";
import { getFeedPosts, getUserPosts, likePost, getLikedPosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/liked/:id", verifyToken, getLikedPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
