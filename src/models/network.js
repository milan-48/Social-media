import mongoose from "mongoose";

const networkSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
      },
    },
  }
);

const Network = mongoose.model("Networks", networkSchema);

export { Network };
