import mongoose from "mongoose";
import { deleteUser, deleteUsers } from "../middleware/usersMiddleware.js";

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

userSchema.pre("findOneAndDelete", deleteUser);
userSchema.pre("deleteOne", deleteUser);
userSchema.pre("deleteMany", deleteUsers);

export const User = mongoose.model("User", userSchema);
