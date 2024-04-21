import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { deleteExam, deleteExams, populateExam } from "../middleware/examsMiddleware.js";

const examSchema = mongoose.Schema({
  s3Key: {
    type: String,
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
    min: 2000,
    max: 2100,
  },
  semester: {
    type: Number,
    enum: [1, 2, 3], // סמסטר א', סמסטר ב', סמסטר קיץ
    required: true,
  },
  term: {
    type: Number,
    enum: [1, 2, 3], // מועד א', מועד ב', מועד ג'
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
  lecturers: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  difficultyRatings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
      },
    },
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

examSchema.plugin(mongoosePaginate);

examSchema.pre("findOneAndDelete", deleteExam);
examSchema.pre("deleteOne", deleteExam);
examSchema.pre("deleteMany", deleteExams);

examSchema.pre("findOne", populateExam);
examSchema.pre("find", populateExam);

examSchema.pre("save", async function (next) {
  const exam = this;

  exam.lecturers = exam.lecturers.sort();
  exam.tags = exam.tags.sort();

  next();
});

export const Exam = mongoose.model("Exam", examSchema);
