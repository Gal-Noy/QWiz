import { Thread } from "../models/threadModels.js";
import { Exam } from "../models/examModel.js";
import { Course, Department } from "../models/infoModels.js";

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

const searchExams = async (subQuery) => {
  let foundExams = [];

  // Course/Department search
  const coursesMatch = await Course.find({ name: { $regex: subQuery, $options: "i" } });
  const departmentsMatch = await Department.find({ name: { $regex: subQuery, $options: "i" } });

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

  // Lecturers search
  const lecturersMatchedExams = await Exam.find({ lecturers: { $regex: subQuery, $options: "i" } }).select("-s3Key");
  if (lecturersMatchedExams.length > 0) {
    for (const exam of lecturersMatchedExams) {
      if (!foundExams.includes(exam)) foundExams.push(exam);
    }
  }

  return foundExams;
};

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

const searchThreads = async (subQuery) => {
  const subQueryWords = subQuery.split(" ").map((word) => new RegExp(word.trim(), "i"));

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

const searchController = {
  freeSearch: async (req, res) => {
    try {
      const queryParts = req.params.query.split(" ");
      if (queryParts.length === 0) return res.status(400).json({ error: "No search query provided" });

      const subQueries = getQuerySubQueries(queryParts);

      const searchResults = {
        exams: [],
        threads: [],
      };
      let examsFound = false;
      let threadsFound = false;

      for (const subQuery of subQueries) {
        if (!examsFound) {
          const foundExams = await searchExams(subQuery);
          if (foundExams.length > 0) {
            const filteredExams = await filterExams(foundExams, subQuery);
            for (const exam of filteredExams) {
              if (!searchResults.exams.includes(exam)) searchResults.exams.push(exam);
            }
            examsFound = true;
          }
        }

        if (!threadsFound) {
          const foundThreads = await searchThreads(subQuery);
          if (foundThreads.length > 0) {
            for (const thread of foundThreads) {
              if (!searchResults.threads.includes(thread)) searchResults.threads.push(thread);
            }
            threadsFound = true;
          }
        }
      }

      res.json(searchResults);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default searchController;
