import { userExistsWithEmail } from "../db/users";
import { createVerificationToken } from "../db/verificationTokens";
import { sendVerificationEmail } from "../lib/accountVerification";
import { User } from "../models/User";

import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
  const users = User.find();
  res.json(users);
};

export const createUser = (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (userExistsWithEmail(email)) {
    return res.status(400).json({ message: "Email not available" });
  }

  const user = new User(name, email, password).create().save();

  if (user && user.id) {
    const verificationToken = createVerificationToken(user.id);
    sendVerificationEmail(user.email, verificationToken.token);
  }

  res.json({ message: "User created" });
};

export const userController = {
  getUsers,
  createUser,
};
