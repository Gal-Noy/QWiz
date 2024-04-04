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
  uploaded_exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
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
});

export const User = mongoose.model("User", userSchema);
