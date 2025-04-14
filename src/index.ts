import { Request, Response } from "express";

import { userExistsWithEmail, users } from "./db/users";
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationToken,
} from "./db/verificationTokens";
import { send } from "process";
import { sendVerificationEmail } from "./lib/accountVerification";
import { userController } from "./controllers/userController";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
console.log("starting server");

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/users", userController.getUsers);

app.get("/verify", (req: Request, res: Response) => {
  const { token } = req.query;
  const verificationToken = getVerificationToken(token as string);
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const user = users.find((user) => user.id === verificationToken.userId);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  user.emailVerified = true;
  user.updatedAt = new Date();
  deleteVerificationToken(token as string);
  res.json({ message: "Email verified" });
});

app.post("/users", userController.createUser);

app.post("/users/update/:id", (req: Request, res: Response) => {});

app.post("/users/delete/:id", (req: Request, res: Response) => {
  //delete user
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
