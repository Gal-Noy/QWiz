import { Exam } from "../models/examModel.js";
import { Faculty, Department, Course } from "../models/catalogModels.js";

const infoController = {
  // Faculties

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

  createFaculty: async (req, res) => {
    try {
      const faculty = new Faculty(req.body);
      await faculty.save();
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);
      faculty.set(req.body);
      await faculty.save();
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.findById(req.params.id);
      await faculty.remove();
      res.json({ message: "Faculty deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Departments

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

  createDepartment: async (req, res) => {
    try {
      const department = new Department(req.body);
      await department.save();
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      department.set(req.body);
      await department.save();
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      await department.remove();
      res.json({ message: "Department deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Courses

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

  createCourse: async (req, res) => {
    try {
      const course = new Course(req.body);
      await course.save();
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      course.set(req.body);
      await course.save();
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      await course.remove();
      res.json({ message: "Course deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Filters

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
