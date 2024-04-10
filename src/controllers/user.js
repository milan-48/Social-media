import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import { User } from "../models/user.js";
import { generateToken } from "../utils/jwtRepository.js";
import { Network } from "../models/network.js";
import { Post } from "../models/Post.js";

/**
 *  User signup
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let updatedPhotoUrl = null;
    if (req.file) {
      updatedPhotoUrl = path.join(
        process.cwd(),
        "/uploads/",
        req.file.filename
      );
    }

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Provide valid details for signup",
        successful: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "User already exists with this email",
        successful: false,
      });
    }

    const user = await User.create({
      name,
      email,
      password, // password hashed in middleware
      role: role || "user",
      photoUrl: updatedPhotoUrl,
    });

    res.status(201).send({
      user,
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during signup process", error);
    return res.status(500).send({
      message: "An error occured during signup process",
      successful: false,
    });
  }
};

/**
 *  User login
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).send({
        message: "Provide valid credentials",
        successful: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        successful: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Please provide correct password",
        successful: false,
      });
    }

    const token = await generateToken(user._id, user.role);

    res.status(200).send({
      user,
      token,
      message: "Login successful",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during signup process", error);
    return res.status(500).send({
      message: "An error occured during signup process",
      successful: false,
    });
  }
};

/**
 *  Update user
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        successful: false,
      });
    }

    // update the user doc as per given body except its id
    const updates = Object.keys(req.body);
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.status(200).send({
      user,
      message: "Update successfully",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during user profile updateion", error);
    return res.status(500).send({
      message: "An error occured during user profile updation",
      successful: false,
    });
  }
};

/**
 *  Get user
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getUser = async (req, res) => {
  try {
    // Assuming that req.user present in incoming request
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        successful: false,
      });
    }

    res.status(200).send({
      user,
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during fetching user profile", error);
    return res.status(500).send({
      message: "An error occured during fetching user profile",
      successful: false,
    });
  }
};

/**
 *  Delete user
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        successful: false,
      });
    }

    res.status(200).send({
      user,
      message: "Deleted successfully",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during fetching user profile", error);
    return res.status(500).send({
      message: "An error occured during fetching user profile",
      successful: false,
    });
  }
};

/**
 *  Follow other user
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const followOtherUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        successful: false,
      });
    }

    await Network.create({
      follower: req.user._id,
      following: userId,
    });

    res.status(200).send({
      message: "Followed",
      successful: true,
    });
  } catch (error) {
    console.error(`An error occured during follow to user: ${userId}`, error);
    return res.status(500).send({
      message: `An error occured during follow to user: ${userId}`,
      successful: false,
    });
  }
};

/**
 *  Get user profile
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        successful: false,
      });
    }

    const posts = await Post.find({ user: req.user._id });

    const followerList = await Network.find({ following: req.user._id }).populate("user");
    const followingList = await Network.find({ followers: req.user._id }).populate("user");

    res.status(200).send({
      user,
      posts,
      followerList,
      followingList,
      successful: true,
    });
  } catch (error) {
    console.error(`An error occured during follow to user: ${userId}`, error);
    return res.status(500).send({
      message: `An error occured during follow to user: ${userId}`,
      successful: false,
    });
  }
};
