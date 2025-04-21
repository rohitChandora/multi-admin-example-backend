import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const user = await User.findOne({
    accessTokens: accessToken,
  });

  if (user) {
    req.currentUser = user;
  }
  next();
}
