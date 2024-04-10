import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import auth from "../middlewares/auth.js";
import {
    deleteUser,
  getUser,
  loginUser,
  signupUser,
  updateUser,
  followOtherUser,
  getUserProfile
} from "../controllers/user.js";
import { uploadFile } from "../middlewares/upload.js";

const router = express.Router();

// no need for authentication
router.post("/", uploadFile.single("avatar"),wrapAsync(signupUser));
router.post("/login", wrapAsync(loginUser));

// need to be authorized
router.post("/follow/:userId", auth(), wrapAsync(followOtherUser))
router.patch("/", auth(), wrapAsync(updateUser));
router.get("/me", auth(), wrapAsync(getUser)); // to view user details
router.get("/profile", auth(),wrapAsync(getUserProfile))

// only admin user can delete any user
router.delete("/:id", auth(["admin"]), wrapAsync(deleteUser));

export default router;
