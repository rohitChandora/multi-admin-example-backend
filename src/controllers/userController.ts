import { userExistsWithEmail } from "../db/users";
import { createVerificationToken } from "../db/verificationTokens";
import { sendVerificationEmail } from "../lib/accountVerification";
import { User } from "../models/User";

import { Request, Response } from "express";
import { VerificationToken } from "../models/VerificationToken";
import { v6 } from "uuid";

export const getUsers = (req: Request, res: Response) => {
  const users = User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (userExistsWithEmail(email)) {
    return res.status(400).json({ message: "Email not available" });
  }

  const verificationToken = await VerificationToken.create({
    token: v6(),
  });

  const user = await User.create({
    email,
    password,
    name,
    verificationTokens: [verificationToken._id],
  });
  sendVerificationEmail(user.email, verificationToken.token);

  res.json({ message: "User created", user });
};

export const userController = {
  getUsers,
  createUser,
};
