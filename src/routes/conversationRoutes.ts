import { conversationController } from "../controllers/conversationController";

const expres = require("express");

const router = expres.Router();

router.post("/", conversationController.createConversation);
router.get("/", conversationController.getAllConversations);
router.get("/list", conversationController.getAllCurrentUsersConversations);
router.get("/:id", conversationController.getConversationById);
router.post("/add-members", conversationController.addUserToConversation);
router.get("/:id/members", conversationController.getConversationMembers);
router.patch(
  "/:id/remove-member",
  conversationController.removeUserFromConversation
);

export { router as conversationRoutes };
