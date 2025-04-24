import { sendVerificationEmail } from "../lib/accountVerification";
import { User } from "../models/User";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { VerificationToken } from "../models/VerificationToken";
import { v6 } from "uuid";

import createHttpError from "http-errors";
import { eventBus } from "../lib/eventBus";
import { EVENTS } from "../lib/constants";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({ email: "dljfkl@kljdkl.com" });
  if (users.length === 0) {
    res.error(createHttpError.Unauthorized("No users found"));
  }
  res.success({ users });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "A user with the email address already exists" });
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

  eventBus.emit(EVENTS["user::created"], { user, verificationToken });
  //fire event user created
  //await sendVerificationEmail(user.email, verificationToken.token);

  res.json({ message: "User created", user });
};

export const userController = {
  getUsers,
  createUser,
};
