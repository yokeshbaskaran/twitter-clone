import Notification from "../models/notify.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!!" });

    if (!text && !img)
      return res.status(404).json({ message: "Post must have text or image" });

    if (img) {
      // console.log("image", img);

      const uploadResponse = await cloudinary.uploader.upload(img);

      // console.log("uploadResponse.secure_url", uploadResponse.secure_url);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });

    //deleting image in cloudinary
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    //deleting postdata in DB
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in deletePost", error);
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id.toString();

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not founf" });

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in commentPost", error);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!!" });

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likes: postId } });
      return res.status(200).json({ message: "Post unliked success" });
    } else {
    }
    //like post
    post.likes.push(userId);
    await User.updateOne({ _id: userId }, { $push: { likes: postId } });
    await post.save();

    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });

    await notification.save();
    res.status(200).json({ message: "Post liked success" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in likeUnlikePost", error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    // console.log(posts);
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in getAllPosts", error);
  }
};

export const getLikesPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    // console.log(posts);
    return res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in getLikesPosts", error);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found!!" });

    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in getFollowingPosts", error);
  }
};
