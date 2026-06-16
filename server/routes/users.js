import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { pushUsersToDB } from "../services/populateUsers.js";

const router = express.Router();

/* WRITE USERS IN BULK */
router.post("/insert_users", pushUsersToDB)

/* READ */
router.get("/", verifyToken, getUsers)
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
