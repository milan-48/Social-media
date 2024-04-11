import express from "express";
import path from "path";
import { Post } from "../models/Post.js";
import { Like } from "../models/like.js";

/**
 * create post
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    let updatedMediaUrl = null;
    if (req.file) {
      updatedMediaUrl = path.join(
        process.cwd(),
        "/uploads/",
        req.file.filename
      );
    }

    if (!title || !content) {
      return res.status(400).send({
        message: "Provide valid title and content",
        successful: false,
      });
    }

    const post = await Post.create({
      user: req.user._id,
      title,
      content,
      tags,
      mediaUrl: updatedMediaUrl,
    });

    return res.status(200).send({
      post,
      message: "Post created",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during creating post", error);
    res.status(500).send({
      message: "An error occured during creating post",
      successful: false,
    });
  }
};

/**
 * list posts
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

export const getPosts = async (req, res) => {
  try {
    const { query, tag } = req.query;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;

    const conditions = {};

    if (query) {
      conditions["$or"] = [
        { title: new RegExp(query, "i") },
        { content: new RegExp(query, "i") },
      ];
    }

    if (tag) {
      console.log("innn");
      conditions["tags"] = {
        tags: {
          $in: [new RegExp(tag, "i")],
        },
      };
    }

    const posts = await Post.find(conditions).populate("user");

    const count = await Post.countDocuments();
    const lastPage = Math.ceil(count / perPage);

    return res.status(200).send({
      pageInfo: {
        currentPage: page,
        lastPage,
        perPage,
        total: count,
      },
      posts,
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during fetching posts ", error);
    res.status(500).send({
      message: "An error occured during fetching posts",
      successful: false,
    });
  }
};

/**
 * update post
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

export const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
        successful: false,
      });
    }

    // Only author of the post can modify their posts
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(400).send({
        message: "You can't modify other's post",
        successful: false,
      });
    }
    ``;
    // update the post doc as per given body except its id
    const updates = Object.keys(req.body);
    updates.forEach((update) => (post[update] = req.body[update]));

    await post.save();

    return res.status(200).send({
      post,
      message: "Post updated successfully",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during updating post");
    res.status(500).send({
      message: "An error occured during updating post",
      successful: false,
    });
  }
};

/**
 * delete post
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */

export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
        successful: false,
      });
    }

    // Only author/admin of can delete post
    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(400).send({
        message: "You can't modify other's post",
        successful: false,
      });
    }

    await Post.findOneAndDelete({ _id: postId });

    return res.status(200).send({
      post,
      message: "Post deleted successfully",
      successful: true,
    });
  } catch (error) {
    console.error("An error occured during deleting post");
    res.status(500).send({
      message: "An error occured during deleting post",
      successful: false,
    });
  }
};

/**
 * list posts for particular user
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const getPostsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;

    const posts = await Post.find({ user: userId }).populate("user");

    const count = await Post.countDocuments();
    const lastPage = Math.ceil(count / perPage);

    return res.status(200).send({
      pageInfo: {
        currentPage: page,
        lastPage,
        perPage,
        total: count,
      },
      posts,
      successful: true,
    });
  } catch (error) {
    console.error(
      `An error occured during fetching posts for userId: ${userId}`,
      error
    );
    res.status(500).send({
      message: `An error occured during fetching posts for userId: ${userId}`,
      successful: false,
    });
  }
};

/**
 * like post
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
        successful: false,
      });
    }

    await Like.create({
      user: req.user._id,
      post: postId,
    });

    return res.status(200).send({
      message: "Liked",
      successful: true,
    });
  } catch (error) {
    console.error(`An error occured during "like" post`, error);
    res.status(500).send({
      message: `An error occured during "like" post`,
      successful: false,
    });
  }
};

/**
 * unlike post
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const unLikePost = async (req, res) => {
  try {
    const { id: likeId } = req.params;

    const like = await Like.findOneAndDelete({ _id: likeId });

    return res.status(200).send({
      message: "Unliked",
      successful: true,
    });
  } catch (error) {
    console.error(`An error occured during "like" post`, error);
    res.status(500).send({
      message: `An error occured during "like" post`,
      successful: false,
    });
  }
};
