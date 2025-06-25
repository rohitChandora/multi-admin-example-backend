import { v6 } from "uuid";

import { User } from "../models/User";
import bcrypt from "bcrypt";

import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("login request body: ", email, password);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const accessToken = v6();
  user.accessTokens.push(accessToken);
  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: false, // set to true in production (with HTTPS)
  //   sameSite: "lax",
  //   maxAge: 60 * 60 * 1000, // 1 hour
  // });
  user.updatedAt = new Date();
  await user.save();

  res.success({ accessToken }, "Login successful");
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.json({ message: "Logged out" });
};
export const authController = {
  login,
  logout,
};
