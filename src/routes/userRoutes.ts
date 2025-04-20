import { Request, Response } from "express";
import { userController } from "../controllers/userController";
import { verificationTokenController } from "../controllers/verificationTokenController";
import { User } from "../models/User";
const expres = require("express");

const router = expres.Router();

router.get("", userController.getUsers);

router.get("/verify", verificationTokenController.verifyToken);

router.post("/", userController.createUser);

router.patch("/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (req.currentUser?.id !== id) {
    return res.status(401).json({
      message: "You are not authorized to update this user",
    });
  }

  req.currentUser.name = name;
  req.currentUser.save();
  res.json({ message: "User updated" });
});

router.post("/delete/:id", (req: Request, res: Response) => {
  //delete user
});

export { router as userRoutes };
