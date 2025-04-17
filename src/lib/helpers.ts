import { Request } from "express";
import { User } from "../models/User";

export const getID = (function () {
  let id = 0;
  return () => {
    return id++;
  };
})();

export async function validateAccessToken(req: Request): Promise<Boolean> {
  const accessTokenHeader = req.headers["authorization"];
  if (!accessTokenHeader) {
    return false;
  }

  const accessToken = (accessTokenHeader as string).split(" ")[1];
  const userWithAccessToken = await User.findOne({
    accessTokens: accessToken,
  });
  if (!userWithAccessToken) {
    return false;
  }

  return true;
}
