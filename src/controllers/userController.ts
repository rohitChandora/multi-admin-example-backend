import { sendVerificationEmail } from "../lib/accountVerification";
import { User } from "../models/User";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { VerificationToken } from "../models/VerificationToken";
import { v6 } from "uuid";

import createHttpError from "http-errors";
import { eventBus } from "../lib/eventBus";
import { EVENTS } from "../lib/constants";
import { pusher } from "../lib/pusher";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
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

export const getCurrentUser = async (req: Request, res: Response) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];

  const user = await User.findOne({ accessTokens: accessToken });
  if (!user) return res.error(createHttpError.Unauthorized("No users found"));
  res.success(user);
};

export const subscribeChannel = async (req: Request, res: Response) => {
  const { userId, channelId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { subscribedConversations: channelId } },
    { new: true }
  ).populate("subscribedConversations");
  pusher.trigger("subscriptions", "channel-subscribed", {
    userId,
    channelId,
  });
  res.success(user);
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("subscribedConversations");
  if (!user) return res.error(createHttpError.Unauthorized("No users found"));
  res.success(user.subscribedConversations);
};

export const userController = {
  getUsers,
  createUser,
  subscribeChannel,
  getUserSubscriptions,
  getCurrentUser,
};
