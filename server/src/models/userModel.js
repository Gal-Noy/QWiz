import mongoose from "mongoose";

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
      difficulty_rating: {
        type: Number,
        min: 0,
        max: 5,
      },
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

export const User = mongoose.model("User", userSchema);
