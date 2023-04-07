import express from "express";
import { saved, getUserSaved } from "../controllers/saved.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:userId/saved", verifyToken, getUserSaved);

/* UPDATE */
router.patch("/:id/saved", verifyToken, saved);

export default router;
