import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        console.log(req.file);
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: req.file?.path,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    const { pageNo } = req.query;
    console.log(pageNo);
    let post;
    try {
        if (pageNo !== undefined) {
            post = await Post.find().skip(pageNo).limit(10);
        } else {
            post = await Post.find();
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        const date = new Date();
        const { id } = req.params;
        const { userId, commentText } = req.body;
        const post = await Post.findById(id);
        post.comments.push({
            _id: new mongoose.Types.ObjectId(),
            userId,
            commentText,
            createdAt: date.getTime(),
        });

        const updatePost = await Post.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );
        console.log(updatePost);
        res.status(200).json(updatePost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { loggedInUserId, commentId } = req.body;
        const post = await Post.findById(id);
        post.comments = post.comments.filter((comment) => {
            return comment._id.toString() !== commentId;
        });

        const updatePost = await Post.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );
        res.status(200).json(updatePost);
    } catch (error) {
        res.status(404).json({ message: err.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { loggedInUserId, postUserId } = req.body;
        // console.log(">>>>>",loggedInUserId, postUserId)
        if (loggedInUserId !== postUserId)
            return res.status(401).json({ message: "unauthorized action" });
        const deleted = await Post.findByIdAndDelete(id);
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
