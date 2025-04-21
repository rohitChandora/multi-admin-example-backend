import { Request, Response } from "express";
import { VerificationToken } from "../models/VerificationToken";
import { User } from "../models/User";
import { validateAccessToken } from "../lib/helpers";

export async function verifyToken(req: Request, res: Response) {
  const { token } = req.query;
  console.log(req.query, "query params");
  console.log(token, "token");

  const verificationToken = await VerificationToken.findOne({ token: token });

  console.log("verificationToken detail: ", verificationToken);
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await User.findOne({
    verificationTokens: verificationToken._id,
  });

  console.log("user detail: ", user);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  user.emailVerified = true;
  user.updatedAt = new Date();
  await user.save();

  //deleteVerificationToken(token as string);
  res.json({ message: "Email verified" });
}

export const verificationTokenController = {
  verifyToken,
};
