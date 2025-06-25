import { Post } from "../models/Post";
import { Request, Response } from "express";
import { User } from "../models/User";
import createHttpError from "http-errors";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.error(createHttpError.NotFound(" posts not  found"));
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { userId, title, description } = req.body;
  console.log("creating post", title, description);

  const user = await User.findById("userId");
  if (!user) {
    return res.error(createHttpError.NotFound("No users found"));
  }
  const post = await Post.create({
    title,
    description,
    userId: user._id,
  });
  res.success({ message: "Post created", post });
};

export const postController = {
  getPosts,
  createPost,
};
