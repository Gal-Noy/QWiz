import React, { useState, useEffect } from "react";
import axiosInstance, { handleResult, handleError } from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import FreeSearchThreadBlock from "./FreeSearchThreadBlock";
import FreeSearchExamBlock from "./FreeSearchExamBlock";
import "./FreeSearchPage.css";

function FreeSearchPage() {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState({ exams: [], threads: [] });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsPending(true);
    axiosInstance
      .get(`/search/${query}`)
      .then((res) => handleResult(res, 200, () => setSearchResults(res.data)))
      .catch((err) => handleError(err, null, () => setError("שגיאה בחיפוש, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  }, [query]);

  return (
    <div className="free-search-page">
      {isPending && <div className="free-search-page-loading">טוען תוצאות...</div>}
      {error && <div className="free-search-page-error">{error}</div>}
      {!isPending && !error && (
        <div className="free-search-results-container">
          {!isPending && !error && searchResults.exams.length > 0 && (
            <div className="free-search-results-list" id="free-search-exams-list">
              <a className="free-search-results-list-header">מבחנים</a>
              <ul className="free-search-list-ul">
                {searchResults.exams.map((exam) => (
                  <FreeSearchExamBlock exam={exam} key={exam._id} />
                ))}
              </ul>
            </div>
          )}
          {!isPending && !error && searchResults.threads.length > 0 && (
            <div className="free-search-results-list" id="free-search-threads-list">
              <a className="free-search-results-list-header">דיונים</a>
              <ul className="free-search-list-ul">
                {searchResults.threads.map((thread) => (
                  <FreeSearchThreadBlock thread={thread} key={thread._id} />
                ))}
              </ul>
            </div>
          )}
          {searchResults.exams.length === 0 && searchResults.threads.length === 0 && (
            <div className="free-search-page-no-results">לא נמצאו תוצאות</div>
          )}
        </div>
      )}
    </div>
  );
}

export default FreeSearchPage;
