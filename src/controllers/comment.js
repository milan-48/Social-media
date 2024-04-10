import express from "express";
import { Comment } from "../models/comment.js";
import { Post } from "../models/Post.js";

/**
 *
 * create comment
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content) {
      return res.status(400).send({
        message: "Please give valid comment for post",
        successful: false,
      });
    }

    // Assuming that postId received in body and can't be empty
    const comment = await Comment.create({
      user: req.user._id,
      post: postId,
      content,
    });

    return res.status(200).send({
      comment,
      message: "Comment created",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during creating comment", error);
    res.status(500).send({
      message: "An error occured during creating comment",
      successful: false,
    });
  }
};

/**
 *
 * Get comments for post
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if(!post) {
        return res.status(404).send({
            message: "Post not found",
            successful: false
        })
    }

    // Assuming that postId received in body and can't be empty
    const comments = await Comment.find({
      post: postId,
    })
      .populate("post")
      .populate("user");

    return res.status(200).send({
      comments,
      message: "Comment created",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during creating comment", error);
    res.status(500).send({
      message: "An error occured during creating comment",
      successful: false,
    });
  }
};
