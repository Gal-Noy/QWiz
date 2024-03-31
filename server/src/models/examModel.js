import mongoose from "mongoose";

const examSchema = mongoose.Schema({
  // s3Path: {
  //   type: String,
  //   required: true,
  // },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    enum: [1, 2, 3], // סמסטר א', סמסטר ב', סמסטר קיץ
    required: true,
  },
  term: {
    type: Number,
    enum: [1, 2, 3], // מועד א', מועד ב', מועד מיוחד
    default: 1,
    required: true,
  },
  type: {
    type: String,
    enum: ["quiz", "test"], // בוחן או מבחן
    default: "test",
    required: true,
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },
  lecturers: {
    type: String,
  },
  difficultyRating: {
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
  },
  // comments: {
  //   type: String,
  // },
  // TODO: Add questions to the exam schema
  //   questions: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Question",
  //     },
  //   ],
});

export const Exam = mongoose.model("Exam", examSchema);
