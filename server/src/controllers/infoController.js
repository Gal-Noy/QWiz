import { Exam } from "../models/examModel.js";
import { Faculty, Department, Course } from "../models/catalogModels.js";

const infoController = {
  getFaculties: async (req, res) => {
    try {
      const faculties = await Faculty.find();
      res.json(faculties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFacultyById: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDepartments: async (req, res) => {
    try {
      const departments = await Department.find();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCourses: async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFacultyDepartments: async (req, res) => {
    try {
      const departments = await Department.find({ faculty: req.params.id });
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDepartmentCourses: async (req, res) => {
    try {
      const courses = await Course.find({ department: req.params.id });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default infoController;
