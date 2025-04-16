import { Request, Response } from "express";

import { userExistsWithEmail, users } from "./db/users";
import {
  deleteVerificationToken,
  getVerificationToken,
} from "./db/verificationTokens";
import { userController } from "./controllers/userController";
import mongoose from "mongoose";
import { verificationTokenController } from "./controllers/verificationTokenController";
require("dotenv").config();

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

app.get("/verify", verificationTokenController.verifyToken);

app.post("/users", userController.createUser);

app.post("/users/update/:id", (req: Request, res: Response) => {});

app.post("/users/delete/:id", (req: Request, res: Response) => {
  //delete user
});

app.listen(port, async () => {
  console.log(process.env.DATABASE_SERVER, "connecting to db");
  await mongoose.connect(process.env.DATABASE_SERVER as string);
  console.log(`Example app listening on port ${port}`);
});
