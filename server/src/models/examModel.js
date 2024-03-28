import mongoose from "mongoose";

const examSchema = mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
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
    required: true,
  },
  lecturers: {
    type: [String],
  },
  faculty: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  ranking: {
    type: Number,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
  },
  // TODO: Add questions to the exam schema
  //   questions: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Question",
  //     },
  //   ],
});

export const Exam = mongoose.model("Exam", examSchema);
