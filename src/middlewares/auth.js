import express from "express";
import { verifyToken } from "../utils/jwtRepository.js";
import { User } from "../models/user.js";

export default function auth(roles = []) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(403).send({
          message: "Please login to continue",
          successful: true,
        });
      }

      const { userId } = await verifyToken(token);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({
          message: "User not found",
          successful: true,
        });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(404).send({
          message: "You are not allowed to access this path",
          successful: true,
        });
      }

      req.user = user;
    } catch (error) {
      return res.status(403).send({
        message: "Please login to continue",
        successful: true,
      });
    }
    next();
  };
}
