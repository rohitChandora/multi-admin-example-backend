import mongoose from "mongoose";
import { users } from "../db/users";
import { verificationTokens } from "../db/verificationTokens";

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
