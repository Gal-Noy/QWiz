import { Course, Department } from "../models/categoriesModels.js";
import { Exam } from "../models/examModel.js";
import { Thread } from "../models/threadModels.js";

/**
 * Get all contiguous subarrays of the search query parts.
 *
 * @function getQuerySubQueries
 * @param {string[]} queryParts - The search query parts.
 * @returns {string[]} - The sub-queries.
 */
const getQuerySubQueries = (queryParts) => {
  const subQueries = [];
  for (let i = 0; i < queryParts.length; i++) {
    for (let j = i + 1; j <= queryParts.length; j++) {
      const subQuery = queryParts.slice(i, j);
      if (subQuery.length > 0) subQueries.push(subQuery.join(" "));
    }
  }
  return subQueries.sort((a, b) => b.length - a.length);
};

/**
 * Search for exams by faculty, course, lecturers and tags.
 *
 * @async
 * @function searchExams
 * @param {string} subQuery - The sub-query.
 * @returns {Exam[]} - The found exams.
 * @throws {Error} - If an error occurred while searching.
 */
const searchExams = async (subQuery) => {
  const subQueryWords = subQuery
    .split(" ")
    .filter((word) => word.trim().length >= 3)
    .map((word) => new RegExp(word.trim(), "i"));

  if (subQueryWords.length === 0) {
    return [];
  }

  let foundExams = [];

  try {
    // Course search by name
    const courseQuery = {
      $or: subQueryWords.map((word) => ({
        name: { $regex: word.source, $options: "i" },
      })),
    };
    const coursesMatch = await Course.find({ $or: [courseQuery] });

    // Department search by name
    const departmentQuery = {
      $or: subQueryWords.map((word) => ({
        name: { $regex: word.source, $options: "i" },
      })),
    };
    const departmentsMatch = await Department.find({ $or: [departmentQuery] });

    // Find department or course matched exams (departments have higher priority than courses)
    if (departmentsMatch.length > 0) {
      const departmentsMatchedExams = await Exam.find({
        course: {
          $in: (
            await Course.find({ department: { $in: departmentsMatch.map((department) => department._id) } })
          ).map((course) => course._id),
        },
      }).select("-s3Key");
      for (const exam of departmentsMatchedExams) {
        if (!foundExams.includes(exam)) foundExams.push(exam);
      }
    } else if (coursesMatch.length > 0) {
      const coursesMatchedExams = await Exam.find({ course: { $in: coursesMatch.map((course) => course._id) } }).select(
        "-s3Key"
      );
      for (const exam of coursesMatchedExams) {
        if (!foundExams.includes(exam)) foundExams.push(exam);
      }
    }

    // Lecturers and tags search
    const lecturersTagsMatchedExams = await Exam.find({
      $or: [{ lecturers: { $in: subQueryWords } }, { tags: { $in: subQueryWords } }],
    }).select("-s3Key");
    if (lecturersTagsMatchedExams.length > 0) {
      for (const exam of lecturersTagsMatchedExams) {
        if (!foundExams.includes(exam)) foundExams.push(exam);
      }
    }
  } catch (error) {
    return [];
  }

  return foundExams;
};

/**
 * Filter exams by year, semester, term and type.
 *
 * @async
 * @function filterExams
 * @param {Exam[]} foundExams - The found exams.
 * @param {string} subQuery - The sub-query.
 * @returns {Exam[]} - The filtered exams.
 */
const filterExams = async (foundExams, subQuery) => {
  // Year filter
  const yearMatch = subQuery.match(/^\d{4}$/);
  const year = yearMatch ? parseInt(yearMatch[0]) : null;
  if (year) {
    foundExams = foundExams.filter((exam) => exam.year === year);
  }

  // Semester filter
  const semesterMapping = {
    "סמסטר א": 1,
    "סמסטר ב": 2,
    "סמסטר קיץ": 3,
  };

  for (const semester of Object.keys(semesterMapping)) {
    if (subQuery.includes(semester)) {
      foundExams = foundExams.filter((exam) => exam.semester === semesterMapping[semester]);
      break;
    }
  }

  // Term filter
  const termMapping = {
    "מועד א": 1,
    "מועד ב": 2,
    "מועד ג": 3,
  };

  for (const term of Object.keys(termMapping)) {
    if (subQuery.includes(term)) {
      foundExams = foundExams.filter((exam) => exam.term === termMapping[term]);
      break;
    }
  }

  // Type filter
  const typeMapping = {
    בוחן: "quiz",
    מבחן: "test",
  };

  for (const type of Object.keys(typeMapping)) {
    if (subQuery.includes(type)) {
      foundExams = foundExams.filter((exam) => exam.type === typeMapping[type]);
      break;
    }
  }

  return foundExams;
};

/**
 * Search for threads by title and tags.
 *
 * @async
 * @function searchThreads
 * @param {string} subQuery - The sub-query.
 * @returns {Thread[]} - The found threads.
 */
const searchThreads = async (subQuery) => {
  const subQueryWords = subQuery
    .split(" ")
    .filter((word) => word.trim().length >= 3)
    .map((word) => new RegExp(word.trim(), "i"));

  if (subQueryWords.length === 0) {
    return [];
  }

  const titleQuery = {
    $or: subQueryWords.map((word) => ({
      title: { $regex: word.source, $options: "i" },
    })),
  };

  const threads = await Thread.find({
    $or: [titleQuery, { tags: { $in: subQueryWords } }],
  });

  return threads;
};

export { getQuerySubQueries, searchExams, filterExams, searchThreads };
