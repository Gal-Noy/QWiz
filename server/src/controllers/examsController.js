import { Exam } from "../models/examModel.js";
import { User } from "../models/userModel.js";
import { Faculty, Department, Course } from "../models/infoModels.js";
import { uploadFile } from "../utils/s3.js";

const examsController = {
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find().populate("course");
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
      const fileKey = `${faculty.name}/${department.name}/${course.name}/${course.code}-${year}-${semester}-${term}.${
        fileType.split("/")[1]
      }`;
      const s3Path = await uploadFile(fileContent, fileKey, fileType);
      // const s3Path = "path/to/s3/file";

      const totalRatings = difficultyRating ? 1 : 0;
      const averageRating = difficultyRating ?? 0;
      const exam = new Exam({
        s3Path,
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
      dbUser.uploaded_exams.push(exam._id);

      await dbUser.save();

      const newExam = await exam.save();

      const response = {
        exam: newExam,
        user: dbUser,
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLastExams: async (req, res) => {
    try {
      const { page } = req.params ?? 1;
      const exams = await Exam.find()
        .populate("course")
        .sort({ createdAt: -1 })
        .limit(10)
        .skip(10 * (page - 1));
      res.json(exams);
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
      const exams = await Exam.find({ course: course._id });
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  filterExams: async (req, res) => {
    try {
      const { faculty, department, course, year, semester, term, type, grade, lecturers, difficultyRating } = req.body;

      if (!faculty || !department || !course) {
        return res.status(400).json({ message: "Please provide faculty, department, and course" });
      }

      const filter = { faculty, department, course };

      if (year) filter.year = year;
      if (semester) filter.semester = semester;
      if (term) filter.term = term;
      if (type) filter.type = type;
      if (grade) filter.grade = { $gte: grade }; // greater than or equal
      if (lecturers) filter.lecturers = lecturers;
      if (difficultyRating) filter.difficultyRating.averageRating = { $gte: difficultyRating }; // greater than or equal

      const exams = await Exam.find(filter).populate("course");
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getExamById: async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id).populate("course");
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
      const user = await User.findById(req.user.user_id).populate({
        path: "uploaded_exams",
        populate: {
          path: "course",
        },
      });
      res.json(user.uploaded_exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFavoriteExams: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id).populate({
        path: "favorite_exams",
        populate: {
          path: "course",
        },
      });
      res.json(user.favorite_exams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addFavoriteExam: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const exam = await Exam.findById(req.body.exam).populate("course");
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
};

export default examsController;
