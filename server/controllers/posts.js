import Post from "../models/Post.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { user, description, picturePath, location } = req.body;

    const newPost = new Post({
      user,
      description,
      location,
      picturePath,
      likes: [],
      comments: [],
    });
    await newPost.save();

    const post = await Post.find().populate("user", "-password").sort({createdAt: 'desc'});
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate("user", "-password").sort({createdAt: 'desc'});
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { user } = req.params;
    const post = await Post.find({ user }).populate("user", "-password").sort({createdAt: 'desc'});
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;

    const postFound = await Post.findById(id).populate("user", "-password");

    if (!postFound.likes.includes(user)) {
      
      postFound.likes.push(user);

    } else {
      // postFound.likes.filter((u) => u !== user);

      const likerIndex = postFound.likes.indexOf(user);

      postFound.likes.splice(likerIndex, 1);
    }
    const saved = await postFound.save();

    res.status(200).json(saved);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
