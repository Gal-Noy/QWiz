import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Faculty, Department, Course } from "../models/infoModels.js";
import { uploadFile, getPresignedUrl } from "../utils/s3.js";

const examsController = {
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find().select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createExam: async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ type: "FileNotUploadedError", message: "Please provide a file" });
      }

      const examData = JSON.parse(req.body.examData);
      if (!examData) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide exam data" });
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
          type: "MissingFieldsError",
          message: "Please provide faculty, department, course, year, semester, term, type, and full contact details.",
        });
      }

      const existingFaculty = await Faculty.findById(faculty._id);
      if (!existingFaculty) {
        return res.status(404).json({ type: "FacultyNotFoundError", message: "Faculty not found" });
      }
      const existingDepartment = await Department.findOne({ name: department.name, faculty: faculty._id });
      if (!existingDepartment) {
        return res.status(404).json({ type: "DepartmentNotFoundError", message: "Department not found" });
      }
      const existingCourse = await Course.findOne({ name: course.name, department: department._id });
      if (!existingCourse) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }
      const existingExam = await Exam.findOne({ course, year, semester, term });
      if (existingExam) {
        return res.status(400).json({ type: "ExamExistsError", message: "Exam already exists" });
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
        dbUser.exams_ratings.push({ exam: exam._id, difficultyRating: difficultyRating });
      }

      await dbUser.save();

      const newExam = await exam.save();
      delete newExam.s3Key;

      const response = {
        exam: newExam,
        user: dbUser,
      };

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCourseExams: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ type: "CourseNotFoundError", message: "Course not found" });
      }

      const exams = await Exam.find({ course: course._id }).select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getExamById: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id).select("-s3Key");

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      return res.json(exam);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateExam: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      exam.set(req.body);
      const updatedExam = await exam.save();

      delete updatedExam.s3Key;

      return res.json(updatedExam);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteExam: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      await exam.remove();

      return res.json({ message: "Exam deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUploadedExams: async (req, res) => {
    try {
      const exams = await Exam.find({ uploadedBy: req.user.user_id }).select("-s3Key");

      return res.json(exams);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getFavoriteExams: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id)
        .populate({
          path: "favorite_exams",
        })
        .select("-s3Key");

      return res.json(user.favorite_exams);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  addFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      user.favorite_exams.push(exam._id);
      await user.save();

      return res.json(user.favorite_exams);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  removeFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const examId = req.params.id;

      user.favorite_exams = user.favorite_exams.filter((exam) => exam._id.toString() !== examId);
      await user.save();

      return res.json(user.favorite_exams);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  rateExam: async (req, res) => {
    try {
      const { rating } = req.body;
      const exam = await Exam.findById(req.params.id).select("-s3Key");

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      const { totalRatings, averageRating } = exam.difficultyRating;

      const dbUser = await User.findById(req.user.user_id);
      const examRating = dbUser.exams_ratings.find((rating) => rating.exam.toString() === req.params.id);

      if (!examRating) {
        // User has not rated this exam before
        const newAverageRating = (averageRating * totalRatings + rating) / (totalRatings + 1);
        exam.difficultyRating = { totalRatings: totalRatings + 1, averageRating: newAverageRating };
        dbUser.exams_ratings.push({ exam: req.params.id, difficultyRating: rating });
      } else {
        // User has rated this exam before
        const oldRating = examRating.difficultyRating;
        const newAverageRating = (averageRating * totalRatings - oldRating + rating) / totalRatings;
        exam.difficultyRating = { totalRatings, averageRating: newAverageRating };
        examRating.difficultyRating = rating;
        dbUser.exams_ratings = dbUser.exams_ratings.map((rating) => {
          if (rating.exam.toString() === req.params.id) {
            return examRating;
          }
          return rating;
        });
      }

      const updatedExam = await exam.save();
      await dbUser.save();

      delete updatedExam.s3Key;
      return res.json({ updatedExam, user: dbUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getPresignedUrl: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      const presignedUrl = await getPresignedUrl(exam.s3Key);

      return res.json({ presignedUrl });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default examsController;
