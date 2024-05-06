import React, { useState, useEffect } from "react";
import ListHeader from "../ListHeader/ListHeader";
import ThreadRow from "./ThreadRow";
import Pagination from "../Pagination/Pagination";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import "./ThreadsList.css";

/**
 * A list of threads component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.query - The query to fetch threads from the server.
 * @param {boolean} props.isProfilePage - Indicates whether the component is rendered on the profile page.
 * @returns {JSX.Element} The rendered ThreadsList component.
 */
function ThreadsList(props) {
  const { query, isProfilePage } = props;

  const [threadsData, setThreadsData] = useState({
    page: "0/0",
    total: 0,
    sortBy: "createdAt",
    sortOrder: "asc",
    data: [],
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [numPages, setNumPages] = useState(threadsData.total > 0 ? Math.ceil(threadsData.total / 10) : 0);
  const [currentPage, setCurrentPage] = useState(0);
  const threadsPerPage = import.meta.env.VITE_PAGE_SIZE || 10;

  // Sorting
  const [sortHeader, setSortHeader] = useState("createdAt");
  const [isAsc, setIsAsc] = useState(true);

  /**
   * Fetch the threads from the server.
   *
   * @async
   * @function fetchThreads
   * @param {string} query - The query to fetch threads from the server.
   * @param {number} currentPage - The current page number.
   * @param {string} sortHeader - The header to sort by.
   * @param {boolean} isAsc - Indicates whether to sort in ascending order.
   * @returns {Promise<void>} A Promise that resolves when the threads are fetched.
   */
  const fetchThreads = async (query, currentPage, sortHeader, isAsc) => {
    setIsPending(true);
    await axiosInstance
      .get(`${query}&page=${currentPage}&sortBy=${sortHeader}&sortOrder=${isAsc ? "asc" : "desc"}`)
      .then((res) =>
        handleResult(res, 200, () => {
          setThreadsData(res.data);
          setNumPages(Math.ceil(res.data.total / threadsPerPage));
        })
      )
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הדיונים.")))
      .finally(() => setIsPending(false));
  };

  // Fetch threads
  useEffect(() => {
    fetchThreads(query, currentPage, sortHeader, isAsc);
    if (currentPage === 0) setCurrentPage(1);
  }, [query, currentPage, sortHeader, isAsc]);

  /**
   * Handles the sort click event.
   *
   * @function handleSortClick
   * @param {string} header - The header to sort by.
   * @returns {void}
   */
  const handleSortClick = (header) => {
    if (header === sortHeader) {
      setIsAsc(!isAsc);
    } else {
      setSortHeader(header);
      setIsAsc(true);
    }
  };

  return (
    <div className={"threads-list" + (isProfilePage ? " is-profile-page" : "")}>
      <label className="threads-list-count">סה"כ דיונים נמצאו: {threadsData.total}</label>
      <div className={"threads-list-container" + (isProfilePage ? " is-profile-page" : "")}>
        <div className={"threads-list-headers-row" + (isProfilePage ? " is-profile-page" : "")}>
          {Object.entries({
            starred: "מסומן בכוכב",
            isClosed: "סטטוס",
            exam: isProfilePage ? "פרטי בחינה" : null,
            title: "נושא",
            creator: "נפתח על ידי",
            createdAt: "תאריך יצירה",
            views: "צפיות",
            comments: "תגובות",
            lastComment: "תגובה אחרונה",
            tags: "תגיות",
          }).map(
            ([header, label]) =>
              label && (
                <ListHeader
                  key={header}
                  label={label}
                  header={header}
                  sortHeader={sortHeader}
                  isAsc={isAsc}
                  handleSortClick={() => handleSortClick(header)}
                />
              )
          )}
        </div>
        {isPending && !error && <div className="lds-dual-ring" id="threads-loading"></div>}
        {error && <div className="threads-list-error">{error}</div>}
        {!isPending && !error && (
          <div className="threads-list-rows">
            {threadsData.data.map((thread) => (
              <ThreadRow
                key={thread._id}
                thread={thread}
                exam={isProfilePage ? thread.exam : null}
                isProfilePage={isProfilePage}
              />
            ))}
          </div>
        )}
      </div>
      <Pagination
        numPages={numPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        dataExists={threadsData.total > 0}
      />
    </div>
  );
}

export default ThreadsList;
