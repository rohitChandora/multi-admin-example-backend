const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export { Message };
