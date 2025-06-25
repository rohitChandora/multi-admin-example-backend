import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  subscribedConversations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  ],
  verificationTokens: [
    {
      type: Schema.Types.ObjectId,
      ref: "VerificationToken",
    },
  ],
  accessTokens: [
    {
      type: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

export { User };
