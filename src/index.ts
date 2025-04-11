import { Request, Response } from "express";
import { createUser, userExistsWithEmail, users } from "./db/users";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
console.log("starting server");

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

app.post("/users", (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (userExistsWithEmail(email)) {
    return res.status(400).json({ message: "Email not available" });
  }
  createUser({
    name,
    email,
    password,
  });
  res.json({ message: "User created" });
  //create user
});

app.post("/users/update/:id", (req: Request, res: Response) => {});

app.post("/users/delete/:id", (req: Request, res: Response) => {
  //delete user
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
