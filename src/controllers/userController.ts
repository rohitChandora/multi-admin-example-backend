import { userExistsWithEmail } from "../db/users";

import { sendVerificationEmail } from "../lib/accountVerification";
import { User } from "../models/User";
import bcrypt from "bcrypt";

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

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    verificationTokens: [verificationToken._id],
  });

  await sendVerificationEmail(user.email, verificationToken.token);

  res.json({ message: "User created", user });
};

export const userController = {
  getUsers,
  createUser,
};
