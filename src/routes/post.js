import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostsForUser,
  likePost,
  unLikePost
} from "../controllers/post.js";
import { uploadFile } from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth(), wrapAsync(getPosts));
router.get("/:userId", auth(), wrapAsync(getPostsForUser));
router.post("/", auth(), uploadFile.single("media"), wrapAsync(createPost));
router.post("/:postId/like", auth(), wrapAsync(likePost));
router.post("/:id/unlike", auth(), wrapAsync(unLikePost));
router.patch("/:id", auth(), wrapAsync(updatePost));
router.delete("/:id", auth(), wrapAsync(deletePost));

export default router;
