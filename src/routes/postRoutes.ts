import { postController } from "../controllers/postController";

const expres = require("express");

const router = expres.Router();

router.get("/", postController.getPosts);
router.post("/", postController.createPost);
