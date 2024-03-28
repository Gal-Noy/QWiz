import { Exam } from "../models/examModel.js";

const infoController = {
  getFaculties: async (req, res) => {
    try {
      const faculties = await Exam.find().distinct("faculty");
      res.json(faculties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDepartmentsByFaculty: async (req, res) => {
    try {
      const departments = await Exam.find({ faculty: req.params.faculty }).distinct("department");
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getCoursesByDepartment: async (req, res) => {
    try {
      const courses = await Exam.find({ department: req.params.department }).distinct("course");
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default infoController;
