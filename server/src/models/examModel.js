import mongoose from "mongoose";

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
  lecturers: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  difficultyRating: {
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
  },
});

examSchema.pre("remove", async function (next) {
  await this.model("Thread").deleteMany({ exam: this._id });

  await this.model("User").updateMany(
    { "exams_ratings.exam": this._id },
    { $pull: { exams_ratings: { exam: this._id } } }
  );

  await this.model("User").updateMany({ favoriteExams: this._id }, { $pull: { favoriteExams: this._id } });

  next();
});

const populateExam = function (next) {
  this.populate({
    path: "course",
    select: "name code",
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

export const Exam = mongoose.model("Exam", examSchema);
