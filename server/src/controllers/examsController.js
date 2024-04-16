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
        // Mandatory fields
        faculty,
        department,
        course,
        year,
        semester,
        term,
        type,
        grade,
        // Optional fields
        lecturers,
        tags,
        difficultyRating,
        // User mandatory fields
        phone_number,
        id_number,
      } = examData;

      if (!faculty || !department || !course || !year || !semester || !term || !type || !phone_number || !id_number) {
        return res.status(400).json({
          type: "MissingFieldsError",
          message: "Please provide faculty, department, course, year, semester, term, type, and full contact details.",
        });
      }

      // Validate faculty, department, course, and exam existence

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

      // Handle user

      const dbUser = await User.findById(req.user.user_id);

      // Validate phone_number, id_number
      if (phone_number) {
        if (!phone_number.match(/^\+?\d{9,20}$/)) {
          return res.status(400).json({ type: "PhoneNumberError", message: "Invalid phone number" });
        }
        if (phone_number.length < 9) {
          return res
            .status(400)
            .json({ type: "PhoneNumberLengthError", message: "Phone number must be at least 9 digits long." });
        }
      }
      if (id_number && !id_number.match(/^\d{9}$/)) {
        return res.status(400).json({ type: "IDNumberError", message: "Invalid ID number" });
      }

      // Update user details if necessary
      if (
        !dbUser.phone_number ||
        !dbUser.id_number ||
        dbUser.phone_number !== phone_number ||
        dbUser.id_number !== id_number
      ) {
        dbUser.phone_number = phone_number;
        dbUser.id_number = id_number;
        await dbUser.save();
      }

      // Update course tags and lecturers if necessary

      if (tags && tags.length > 0) {
        existingCourse.tags = [...new Set([...existingCourse.tags, ...tags])];
        await existingCourse.save();
      }
      if (lecturers && lecturers.length > 0) {
        existingCourse.lecturers = [...new Set([...existingCourse.lecturers, ...lecturers])];
        await existingCourse.save();
      }

      // Upload file to S3

      const fileContent = file.buffer;
      const fileType = file.mimetype;
      const s3Key = `${faculty.name}/${department.name}/${course.name}/${course.code}-${year}-${semester}-${term}.${
        fileType.split("/")[1]
      }`;
      await uploadFile(fileContent, s3Key, fileType);

      // Save exam

      const exam = new Exam({
        s3Key,
        course,
        year,
        semester,
        term,
        type,
        grade,
        lecturers: lecturers ? lecturers : [],
        tags: tags ? tags : [],
        difficultyRatings: difficultyRating > 0 ? [{ user: req.user.user_id, rating: difficultyRating }] : [],
        uploadedBy: req.user.user_id,
      });

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
      const exam = await Exam.findByIdAndDelete(req.params.id);

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

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
      const user = await User.findById(req.user.user_id).populate({
        path: "favorite_exams",
        select: "-s3Key",
      });

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

      if (rating < 0 || rating > 5) {
        return res.status(400).json({ type: "InvalidRatingError", message: "Rating must be between 0 and 5" });
      }

      const existingRating = exam.difficultyRatings.find((rating) => rating.user.toString() === req.user.user_id);

      if (existingRating) {
        existingRating.rating = rating;
      } else {
        exam.difficultyRatings.push({ user: req.user.user_id, rating });
      }

      await exam.save();

      return res.json(exam);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  addTags: async (req, res) => {
    try {
      const { tags } = req.body;
      const exam = await Exam.findById(req.params.id).select("-s3Key");

      if (!exam) {
        return res.status(404).json({ type: "ExamNotFoundError", message: "Exam not found" });
      }

      if (!tags || tags.length === 0) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please provide tags" });
      }

      exam.tags = [...new Set([...exam.tags, ...tags])];
      await exam.save();

      return res.json(exam);
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
