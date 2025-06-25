import { Request, Response } from "express";
import { pusher } from "../lib/pusher";
import { Message } from "../models/Message";

export const createMessage = async (req: Request, res: Response) => {
  const { username, message, conversationName } = req.body;

  console.log(username, message, conversationName, "/message api");

  // await pusher.trigger(conversationName, "new-message", {
  //   username,
  //   message,
  // });
  const messageData = await Message.create({
    username,
    message,
    conversationId: conversationName,
  });
  messageData.save();

  res.status(200).send("Message sent");
};

export const getAllMessagesByConversationId = async (
  req: Request,
  res: Response
) => {
  const { conversationId } = req.params;
  const { username } = req.body;

  try {
    const firstUserMessage = await Message.findOne({
      username,
      conversationId,
    }).sort({ createdAt: 1 });

    if (!firstUserMessage) {
      return res.status(404).json({
        message: "No messages found for this user in the conversation",
      });
    }

    const messages = await Message.find({
      conversationId,
      createdAt: { $gte: firstUserMessage.createdAt },
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.error({ message: "Server error" });
  }
};

export const messageController = {
  createMessage,
  getAllMessagesByConversationId,
};
