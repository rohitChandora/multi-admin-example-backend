require("dotenv").config();
import app from "./lib/bootstrap";

import { userController } from "./controllers/userController";
import mongoose from "mongoose";

import { transporter } from "./lib/email";
import { authController } from "./controllers/authController";
import cors from "cors";
import { userRoutes } from "./routes";

import { queue } from "./lib/queue";
import "./lib/worker";
import { Request, Response } from "express";
import "./lib/event-listeners";
const bodyParser = require("body-parser");

const port = 3000;
console.log("starting server");
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userController.getUsers);

app.post("/auth/login", authController.login);

app.use("/users", userRoutes);

app.get("/test/queue", async (req: Request, res: Response) => {
  // await queue.add("handle-verification", {
  //   test: "testing",
  //   url: "/test/queue",
  // });
  // res.json({ message: "Job added to queue" });
  res.success({ message: "Testing the success" });
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
