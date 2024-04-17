import mongoose from "mongoose";
import { deleteFile } from "../utils/s3.js";
import { Thread } from "./threadModels.js";
import { User } from "./userModel.js";

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

const deleteExam = async function (next) {
  const examToDelete = await this.model.findOne(this.getQuery());
  const { _id: examId, s3Key } = examToDelete;

  try {
    await deleteFile(s3Key);

    await Thread.deleteMany({ exam: examId });

    await User.updateMany({ favorite_exams: examId }, { $pull: { favorite_exams: examId } });

    next();
  } catch (error) {
    next(error);
  }
};

const deleteExams = async function (next) {
  const examsToDelete = await this.model.find(this.getQuery());
  const examIds = examsToDelete.map((exam) => exam._id);

  try {
    await Thread.deleteMany({ exam: { $in: examIds } });

    await User.updateMany({ favorite_exams: { $in: examIds } }, { $pull: { favorite_exams: { $in: examIds } } });

    next();
  } catch (error) {
    next(error);
  }
};

examSchema.pre("findOneAndDelete", deleteExam);
examSchema.pre("deleteOne", deleteExam);
examSchema.pre("deleteMany", deleteExams);

const populateExam = function (next) {
  this.populate({
    path: "course",
    select: "name code tags",
    populate: {
      path: "department",
      select: "name",
      populate: {
        path: "faculty",
        select: "name",
      },
    },
  });
  this.populate({
    path: "uploadedBy",
    select: "name",
  });
  next();
};

examSchema.pre("findOne", populateExam);
examSchema.pre("find", populateExam);

examSchema.pre("save", async function (next) {
  const exam = this;

  exam.lecturers = exam.lecturers.sort();
  exam.tags = exam.tags.sort();

  next();
});

export const Exam = mongoose.model("Exam", examSchema);
