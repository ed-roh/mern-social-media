import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const submitComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    const postFound = await Post.findById(postId).populate("user", "-password");
    const userFound = await User.findById(userId);

    postFound.comments.push({
      user: {
        userId,
        picturePath: userFound.picturePath,
      },
      comment,
    });

    const saved = await postFound.save();

    res.status(200).json(saved);
  } catch (error) {}
};

export const deleteComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentId } = req.body;

    const postFound = await Post.findById(postId).populate("user", "-password");

    postFound.comments.splice(
      postFound.comments.findIndex((e) => e._id == commentId),
      1
    );

    const saved = await postFound.save();

    res.status(200).json(saved);
  } catch (error) {}
};
