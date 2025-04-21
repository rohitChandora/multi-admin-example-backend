import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export const getID = (function () {
  let id = 0;
  return () => {
    return id++;
  };
})();

export async function validateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessTokenHeader = req.headers["authorization"];
  if (!accessTokenHeader) {
    return res.status(401).json({
      message: "Access token is missing",
    });
  }

  const accessToken = (accessTokenHeader as string).split(" ")[1];
  const userWithAccessToken = await User.findOne({
    accessTokens: accessToken,
  });
  if (!userWithAccessToken) {
    return res.status(401).json({
      message: "Invalid access token",
    });
  }

  req.currentUser = userWithAccessToken;

  next();
}
