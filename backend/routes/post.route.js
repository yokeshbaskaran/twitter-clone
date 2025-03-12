import express from "express";
import {
  getAllPosts,
  getFollowingPosts,
  getLikesPosts,
  createPost,
  likeUnlikePost,
  commentPost,
  deletePost,
} from "../controllers/post.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikesPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/delete/:id", protectRoute, deletePost);

export default router;
