import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Course } from "../models/infoModels.js";
import { Forum } from "../models/forumModels.js";
import { uploadFile, getPresignedUrl } from "../utils/s3.js";

const examsController = {
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find().populate("course").select("-s3Key");
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createExam: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      const examData = JSON.parse(req.body.examData);
      if (!examData) {
        return res.status(400).json({ message: "Please provide exam data" });
      }

      const {
        faculty,
        department,
        course,
        year,
        semester,
        term,
        type,
        grade,
        lecturers,
        difficultyRating,
        phone_number,
        id_number,
      } = examData;

      if (!faculty || !department || !course || !year || !semester || !term || !type || !phone_number || !id_number) {
        return res.status(400).json({
          message: "Please provide faculty, department, course, year, semester, term, type, and full contact details.",
        });
      }

      const existingExam = await Exam.findOne({ course, year, semester, term });
      if (existingExam) {
        return res.status(400).json({ message: "Exam already exists" });
      }

      const fileContent = file.buffer;
      const fileType = file.mimetype;
      const s3Key = `${faculty.name}/${department.name}/${course.name}/${course.code}-${year}-${semester}-${term}.${
        fileType.split("/")[1]
      }`;
      await uploadFile(fileContent, s3Key, fileType);

      const totalRatings = difficultyRating > 0 ? 1 : 0;
      const averageRating = difficultyRating;
      const exam = new Exam({
        s3Key,
        faculty,
        department,
        course,
        year,
        semester,
        term,
        type,
        grade,
        lecturers,
        difficultyRating: { totalRatings, averageRating },
        uploadedBy: req.user.user_id,
      });

      // Handle user
      const dbUser = await User.findById(req.user.user_id);

      if (
        !dbUser.phone_number ||
        !dbUser.id_number ||
        dbUser.phone_number !== phone_number ||
        dbUser.id_number !== id_number
      ) {
        dbUser.phone_number = phone_number;
        dbUser.id_number = id_number;
      }
      if (difficultyRating > 0) {
        dbUser.exams_ratings.push({ exam: exam._id, difficulty_rating: difficultyRating });
      }

      await dbUser.save();

      const newExam = await exam.save();
      newExam.s3Key = undefined;

      const response = {
        exam: newExam,
        user: dbUser,
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCourseExams: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const exams = await Exam.find({ course: course._id }).populate("course").select("-s3Key");
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getExamById: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id)
        .populate("course")
        .populate({
          path: "department",
          populate: {
            path: "faculty",
            select: "name",
          },
        })
        .select("-s3Key");

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateExam: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      exam.set(req.body);
      const updatedExam = await exam.save();
      updatedExam.s3Key = undefined;
      res.json(updatedExam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteExam: async (req, res) => {
    try {
      await Exam.findByIdAndDelete(req.params.id);
      res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUploadedExams: async (req, res) => {
    try {
      const exams = await Exam.find({ uploadedBy: req.user.user_id }).populate("course").select("-s3Key");
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFavoriteExams: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id)
        .populate({
          path: "favorite_exams",
          populate: {
            path: "course",
          },
        })
        .select("-s3Key");
      res.json(user.favorite_exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const exam = await Exam.findById(req.body.exam).populate("course").select("-s3Key");
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      user.favorite_exams.push(exam._id);
      await user.save();
      res.json(user.favorite_exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const examId = req.params.id;
      user.favorite_exams = user.favorite_exams.filter((exam) => exam._id.toString() !== examId);
      await user.save();
      res.json(user.favorite_exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  rateExam: async (req, res) => {
    try {
      const { rating } = req.body;
      const exam = await Exam.findById(req.params.id)
        .populate("course")
        .populate({
          path: "department",
          populate: {
            path: "faculty",
            select: "name",
          },
        })
        .select("-s3Key");

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      const { totalRatings, averageRating } = exam.difficultyRating;

      const dbUser = await User.findById(req.user.user_id);
      const examRating = dbUser.exams_ratings.find((rating) => rating.exam.toString() === req.params.id);

      if (!examRating) {
        // User has not rated this exam before
        const newAverageRating = (averageRating * totalRatings + rating) / (totalRatings + 1);
        exam.difficultyRating = { totalRatings: totalRatings + 1, averageRating: newAverageRating };
        dbUser.exams_ratings.push({ exam: req.params.id, difficulty_rating: rating });
      } else {
        // User has rated this exam before
        const oldRating = examRating.difficulty_rating;
        const newAverageRating = (averageRating * totalRatings - oldRating + rating) / totalRatings;
        exam.difficultyRating = { totalRatings, averageRating: newAverageRating };
        examRating.difficulty_rating = rating;
        dbUser.exams_ratings = dbUser.exams_ratings.map((rating) => {
          if (rating.exam.toString() === req.params.id) {
            return examRating;
          }
          return rating;
        });
      }

      const updatedExam = await exam.save();
      await dbUser.save();

      updatedExam.s3Key = undefined;
      res.json({ updatedExam, user: dbUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPresignedUrl: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      const presignedUrl = await getPresignedUrl(exam.s3Key);
      res.json({ presignedUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default examsController;
