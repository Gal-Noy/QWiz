/**
 * Paginates and sorts the data based on the request
 *
 * @async
 * @function paginateAndSort
 * @param {Model} Model - The model to query
 * @param {Object} query - The query to filter the data
 * @param {Object} req - The request object
 * @returns {Object} - The paginated and sorted data
 */
const paginateAndSort = async (Model, query, req) => {
  const { pageNum, pageSize } = req.pagination;

  const data = await Model.find(query)
    .sort(req.sort)
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  const totalDocuments = await Model.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / pageSize);

  return {
    page: `${pageNum}/${Math.ceil(data.length / totalPages)}`,
    total: totalDocuments,
    sortBy: Object.keys(req.sort)[0],
    sortOrder: Object.values(req.sort)[0] === 1 ? "asc" : "desc",
    data,
  };
};

/**
 * Paginates the data with a custom sort function
 *
 * @async
 * @function paginateWithCustomSort
 * @param {Model} Model - The model to query
 * @param {Object} query - The query to filter the data
 * @param {Object} req - The request object
 * @param {Function} customSort - The custom sort function
 * @returns {Object} - The paginated data
 */
const paginateWithCustomSort = async (Model, query, req, customSort) => {
  const { pageNum, pageSize } = req.pagination;

  let data = await Model.find(query);
  data = data.sort(customSort);

  const totalDocuments = data.length;
  const totalPages = Math.ceil(totalDocuments / pageSize);

  return {
    page: `${pageNum}/${totalPages}`,
    total: totalDocuments,
    sortBy: Object.keys(req.sort)[0],
    sortOrder: Object.values(req.sort)[0] === 1 ? "asc" : "desc",
    data: data.slice((pageNum - 1) * pageSize, pageNum * pageSize),
  };
};

/**
 * Sorts the data based on the request
 *
 * @async
 * @function sortOnly
 * @param {Model} Model - The model to query
 * @param {Object} query - The query to filter the data
 * @param {Object} req - The request object
 * @returns {Object} - The sorted data
 */
const sortOnly = async (Model, query, req) => {
  const data = await Model.find(query).sort(req.sort);

  return {
    sortBy: Object.keys(req.sort)[0],
    sortOrder: Object.values(req.sort)[0] === 1 ? "asc" : "desc",
    data,
  };
};

export { paginateAndSort, paginateWithCustomSort, sortOnly };
