import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import auth from "../middlewares/auth.js";
import { createComment, getCommentsForPost } from "../controllers/comment.js";

const router = express.Router();


router.post("/", auth(), wrapAsync(createComment))
router.get("/:postId", auth(), wrapAsync(getCommentsForPost))

export default router;
