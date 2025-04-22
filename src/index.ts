require("dotenv").config();
import { Request, Response } from "express";

import { userController } from "./controllers/userController";
import mongoose from "mongoose";

import { transporter } from "./lib/email";
import { authController } from "./controllers/authController";
import cors from "cors";
import { userRoutes } from "./routes";
import { validateAccessToken } from "./lib/helpers";

import { queue } from "./lib/queue";
import "./lib/worker";

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

app.get("/test/queue", async (req: Request, res: Response) => {
  await queue.add("handle-verification", {
    test: "testing",
    url: "/test/queue",
  });
  res.json({ message: "Job added to queue" });
});

app.post("/verify-email", async (req: Request, res: Response) => {
  await queue.add("verify-email", {
    email: req.body.email,
    token: req.body.token,
  });
  res.json({ message: "verification email sent successfully" });
});

app.post("/change-password", async (req: Request, res: Response) => {
  await queue.add("password-change", {
    email: req.body.email,
    token: req.body.token,
  });
  res.json({ message: "password change email sent successfully" });
});
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

async function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  //await redisClient.quit();
  await mongoose.connection.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
