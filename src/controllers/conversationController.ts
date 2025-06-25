import { Request, Response } from "express";
import { pusher } from "../lib/pusher";
import { User } from "../models/User";
import { Conversation } from "../models/Conversation";

export const createConversation = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const conversation = new Conversation({ name, createdBy: user._id });
  await conversation.save();

  pusher.trigger("conversations", "new-conversation", {
    _id: conversation._id,
    name: conversation.name,
    createdBy: conversation.createdBy,
  });
  user.subscribedConversations.push(conversation._id);
  await user.save();
  res.success({ conversation });
};

export const getAllConversations = async (req: Request, res: Response) => {
  const conversations = await Conversation.find();
  res.success(conversations);
};

export const getAllCurrentUsersConversations = async (
  req: Request,
  res: Response
) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  console.log("accessToken:", accessToken);

  const user = await User.findOne({ accessTokens: accessToken });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  await user.populate("subscribedConversations");
  const conversations = user.subscribedConversations;
  res.success(conversations);
};
export const getConversationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id:", id);

  const conversation = await Conversation.findById({ _id: id });

  res.success(conversation);
};

export const getConversationMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id:", id);

  const conversation = await Conversation.findById({ _id: id });
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  await conversation.populate("members");
  await conversation.populate("createdBy");
  const members = conversation.members;
  const createdBy = conversation.createdBy;
  const allMembers = [createdBy, ...members];

  res.success({ allMembers });
};

export const addUserToConversation = async (req: Request, res: Response) => {
  const { conversationId, userIds } = req.body;
  if (!conversationId || !Array.isArray(userIds)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  const newUserIds = userIds.filter((id) => !conversation.members.includes(id));

  conversation.members.push(...newUserIds);
  await conversation.save();

  await User.updateMany(
    { _id: { $in: newUserIds } },
    { $addToSet: { subscribedConversations: conversationId } } // avoid duplicates
  );

  return res.status(200).json({
    message: "Users and Conversation updated successfully",
    data: {
      conversationId,
      addedUsers: newUserIds,
    },
  });
};

export const removeUserFromConversation = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.body;
  const { id } = req.params;
  const conversationId = id;
  if (!conversationId || !userId) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  const userIndex = conversation.members.indexOf(userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found in conversation" });
  }
  conversation.members.splice(userIndex, 1);
  await conversation.save();
  await User.findByIdAndUpdate(userId, {
    $pull: { subscribedConversations: conversationId },
  });
  return res.status(200).json({
    message: "User removed from conversation successfully",
    data: {
      conversationId,
      removedUser: userId,
    },
  });
};

export const conversationController = {
  createConversation,
  getAllConversations,
  getConversationMembers,
  getAllCurrentUsersConversations,
  getConversationById,
  addUserToConversation,
  removeUserFromConversation,
};
