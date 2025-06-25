const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export { Conversation };
