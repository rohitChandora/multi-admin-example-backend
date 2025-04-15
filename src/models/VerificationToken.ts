import mongoose from "mongoose";

const { Schema } = mongoose;

const verificationTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h", // Token expires after 1 hour
  },
});

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export { VerificationToken };
