import { Post } from "../models/Post";
import { Request, Response } from "express";
import { User } from "../models/User";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  console.log("creating post", title, description);

  //   const user = User.findById("123");
  const post = await Post.create({
    title,
    description,
  });
  res.json({ message: "Post created", post });
};

export const postController = {
  getPosts,
  createPost,
};
