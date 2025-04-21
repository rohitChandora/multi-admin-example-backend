import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  accessTokens: [
    {
      type: String,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

export { Post };
