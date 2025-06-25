import { messageController } from "../controllers/messageController";

const expres = require("express");

const router = expres.Router();

router.post("/", messageController.createMessage);
router.post(
  "/:conversationId",
  messageController.getAllMessagesByConversationId
);

export { router as messageRoutes };
