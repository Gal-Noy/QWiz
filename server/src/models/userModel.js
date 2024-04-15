import mongoose from "mongoose";
import { Thread } from "./threadModels.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  id_number: {
    type: String,
  },
  favorite_exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  exams_ratings: [
    {
      exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
      difficultyRating: {
        type: Number,
        min: 0,
        max: 5,
      },
    },
  ],
  starred_threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const deleteUser = async function (next) {
  const userId = this._conditions._id;

  if (this._conditions.role === "admin") {
    console.warn("Admins can't be deleted");
    return next();
  }

  try {
    await Thread.deleteMany({ creator: userId });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteUsers = async function (next) {
  const userIds = this._conditions._id;

  try {
    await Thread.deleteMany({ creator: { $in: userIds } });

    next();
  } catch (error) {
    next(error);
  }
};

userSchema.pre("findOneAndDelete", deleteUser);
userSchema.pre("deleteOne", deleteUser);
userSchema.pre("deleteMany", deleteUsers);

export const User = mongoose.model("User", userSchema);
