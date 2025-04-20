require("dotenv").config();
import { Request, Response } from "express";

import { userController } from "./controllers/userController";
import mongoose from "mongoose";
import { verificationTokenController } from "./controllers/verificationTokenController";
import { transporter } from "./lib/email";
import { authController } from "./controllers/authController";
import cors from "cors";
import { userRoutes } from "./routes";
import { validateAccessToken } from "./lib/helpers";
import { getCurrentUser } from "./middleware/getCurrentUser";
import { User } from "./models/User";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
console.log("starting server");
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userController.getUsers);

app.post("/auth/login", authController.login);

app.use("/users", [validateAccessToken], userRoutes);

app.listen(port, async () => {
  transporter
    .verify()
    .then(() => {
      console.log("SMTP Server is ready to take messages");
    })
    .catch(console.error);
  await mongoose.connect(process.env.DATABASE_SERVER as string);
  console.log(`Example app listening on port ${port}`);
});
