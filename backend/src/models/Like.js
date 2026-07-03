import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// prevent duplicate likes (VERY IMPORTANT)
likeSchema.index({ user: 1, project: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;