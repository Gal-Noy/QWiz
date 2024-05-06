import React, { useState, useEffect } from "react";
import ExamRow from "./ExamRow";
import ListHeader from "../ListHeader/ListHeader";
import Pagination from "../Pagination/Pagination";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import "./ExamsList.css";

/**
 * Renders a list of exams.
 *
 * @param {Object} props - The component props.
 * @param {string} props.query - The query to fetch exams from the server.
 * @param {boolean} props.showExams - Indicates whether to show the exams.
 * @param {boolean} props.isProfilePage - Indicates whether the component is rendered on the profile page.
 * @returns {JSX.Element|null} The rendered component.
 */
function ExamsList(props) {
  const { query, showExams, isProfilePage } = props;

  const [examsData, setExamsData] = useState({
    page: "0/0",
    total: 0,
    sortBy: "createdAt",
    sortOrder: "asc",
    data: [],
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [numPages, setNumPages] = useState(examsData.total > 0 ? Math.ceil(examsData.total / 10) : 0);
  const [currentPage, setCurrentPage] = useState(0);
  const examsPerPage = import.meta.env.VITE_PAGE_SIZE || 10;

  // Sorting
  const [sortHeader, setSortHeader] = useState("createdAt");
  const [isAsc, setIsAsc] = useState(true);

  const fetchExams = async (query, currentPage, sortHeader, isAsc) => {
    setIsPending(true);
    await axiosInstance
      .get(`${query}&page=${currentPage}&sortBy=${sortHeader}&sortOrder=${isAsc ? "asc" : "desc"}`)
      .then((res) =>
        handleResult(res, 200, () => {
          setExamsData(res.data);
          setNumPages(Math.ceil(res.data.total / examsPerPage));
        })
      )
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת המבחנים.")))
      .finally(() => setIsPending(false));
  };

  // Fetch the exams
  useEffect(() => {
    if (showExams) {
      fetchExams(query, currentPage, sortHeader, isAsc);
      if (currentPage === 0) setCurrentPage(1);
    }
  }, [query, currentPage, sortHeader, isAsc]);

  const handleSortClick = (header) => {
    if (header === sortHeader) {
      setIsAsc(!isAsc);
    } else {
      setSortHeader(header);
      setIsAsc(true);
    }
  };

  return !showExams ? null : (
    <div className="exams-list">
      <label className="exams-list-count">סה"כ בחינות נמצאו: {examsData.total}</label>
      <div className={"exams-list-container" + (isProfilePage ? " is-profile-page" : "")}>
        <div className={"exams-list-headers-row" + (isProfilePage ? " is-profile-page" : "")}>
          {Object.entries({
            favorites: "מועדפים",
            "course-code": "מספר קורס",
            "course-name": "שם הקורס",
            lecturers: "מרצים",
            type: "סוג בחינה",
            year: "שנה",
            semester: "סמסטר",
            term: "מועד",
            grade: "ציון",
            rating: "דירוג",
            tags: "תגיות",
          }).map(([header, label]) => (
            <ListHeader
              key={header}
              label={label}
              header={header}
              sortHeader={sortHeader}
              isAsc={isAsc}
              handleSortClick={() => handleSortClick(header)}
            />
          ))}
        </div>
        {isPending && !error && <div className="lds-dual-ring" id="exams-loading"></div>}
        {error && <div className="exams-list-error">{error}</div>}
        {!isPending && !error && (
          <div className="exams-list-rows">
            {examsData.data.map((exam) => (
              <ExamRow key={exam._id} exam={exam} isProfilePage={isProfilePage} />
            ))}
          </div>
        )}
      </div>
      <Pagination numPages={numPages} currentPage={currentPage} setCurrentPage={setCurrentPage} dataExists={examsData.total > 0}/>
    </div>
  );
}

export default ExamsList;
