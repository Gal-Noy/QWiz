import { getQuerySubQueries, searchExams, searchThreads, filterExams } from "../utils/freeSearchUtils.js";

/**
 * Controller for the free search endpoint.
 */
const searchController = {
  /**
   * Search for exams and threads based on a query.
   *
   * @async
   * @function freeSearch
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The search results (exams and threads).
   * @throws {MissingFieldsError} - Missing search query.
   * @throws {Error} - If an error occurred while searching.
   */
  freeSearch: async (req, res) => {
    try {
      const queryParts = req.params.query.split(" ");

      if (queryParts.length === 0) {
        return res.status(400).json({ type: "MissingFieldsError", message: "Please enter a search query" });
      }

      // Get sub-queries from the search query
      // The sub-queries are all contiguous subarrays of the search query parts
      // They are sorted by length in descending order, so that the longest sub-queries are searched first (more specific)
      const subQueries = getQuerySubQueries(queryParts);

      const searchResults = {
        exams: [],
        threads: [],
      };
      let examsFound = false;
      let threadsFound = false;

      for (const subQuery of subQueries) {
        if (!examsFound) {
          const foundExams = await searchExams(subQuery); // Search for faculty, course, lecturers and tags.
          if (foundExams.length > 0) {
            const filteredExams = await filterExams(foundExams, subQuery); // Filter by year, semester, term and type.
            for (const exam of filteredExams) {
              if (!searchResults.exams.includes(exam)) searchResults.exams.push(exam);
            }
            examsFound = true;
          }
        }

        if (!threadsFound) {
          const foundThreads = await searchThreads(subQuery); // Search for threads by title and tags.
          if (foundThreads.length > 0) {
            for (const thread of foundThreads) {
              if (!searchResults.threads.includes(thread)) searchResults.threads.push(thread);
            }
            threadsFound = true;
          }
        }

        if (examsFound && threadsFound) break;
      }

      return res.json(searchResults);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default searchController;
