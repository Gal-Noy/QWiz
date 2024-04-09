import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ListHeader from "../ListHeader";
import ThreadRow from "./ThreadRow";
import "../../styles/ExamForum.css";

function ExamForum({ examId }) {
  const [threads, setThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [starredThreads, setStarredThreads] = useState([]);
  const [sortHeader, setSortHeader] = useState("");
  const [numPages, setNumPages] = useState(threads.length > 0 ? Math.ceil(threads.length / 10) : 0);
  const [currentPage, setCurrentPage] = useState(1);

  const threadsPerPage = 10;
  const lastThreadIndex = currentPage * threadsPerPage;
  const firstThreadIndex = lastThreadIndex - threadsPerPage;
  const currentThreads = threads.slice(firstThreadIndex, lastThreadIndex);

  useEffect(() => {
    setIsPending(true);
    axiosInstance
      .get(`threads/exam/${examId}`)
      .then((res) => handleResult(res, 200, () => setThreads(res.data)))
      .then(() => setIsPending(false))
      .catch((err) =>
        handleError(err, () => {
          console.error(err.response.data.message);
          setError("שגיאה בטעינת הדיונים, אנא נסה שנית.");
          setIsPending(false);
        })
      );
  }, [examId]);

  useEffect(() => {
    axiosInstance
      .get("/threads/starred")
      .then((res) =>
        handleResult(res, 200, () => {
          const starredThreadsIds = res.data.map((thread) => thread._id);
          setStarredThreads(starredThreadsIds);
        })
      )
      .catch((err) =>
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בטעינת הדיונים המסומנים בכוכב, אנא נסה שנית.");
        })
      );
  }, []);

  useEffect(() => {
    setNumPages(Math.ceil(threads.length / threadsPerPage));
  }, [threads]);

  return (
    <div className="exam-forum">
      <span
        onClick={() => {
          window.location.href = `/exam/${examId}/new-thread`;
        }}
        className="material-symbols-outlined add-thread-button"
      >
        add
      </span>
      <div className="threads-list">
        <label className="threads-list-count">סה"כ דיונים נמצאו: {threads.length}</label>
        {!isPending && !error && numPages > 1 && (
          <div className="threads-list-pagination">
            <span
              className={"material-symbols-outlined navigation-arrow" + (currentPage > 1 ? " enabled" : "")}
              onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            >
              arrow_forward_ios
            </span>
            {numPages} / {currentPage}
            <span
              className={"material-symbols-outlined navigation-arrow" + (currentPage < numPages ? " enabled" : "")}
              onClick={() => {
                if (currentPage < numPages) setCurrentPage(currentPage + 1);
              }}
            >
              arrow_back_ios
            </span>
          </div>
        )}
        <div className="threads-list-container">
          <div className="threads-list-headers-row">
            <ListHeader
              label="מסומן בכוכב"
              header="starred"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads.slice().sort((a, b) => (starredThreads.includes(a._id) ? -1 : 1) * (isAsc ? 1 : -1))
                )
              }
            />
            <ListHeader
              label="סטטוס"
              header="isClosed"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) => (a.isClosed === b.isClosed ? 0 : a.isClosed ? (isAsc ? 1 : -1) : isAsc ? -1 : 1))
                )
              }
            />
            <ListHeader
              label="נושא"
              header="title"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) => (isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)))
                )
              }
            />
            <ListHeader
              label="נפתח על ידי"
              header="creator"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) =>
                      isAsc
                        ? a.creator.name.localeCompare(b.creator.name)
                        : b.creator.name.localeCompare(a.creator.name)
                    )
                )
              }
            />
            <ListHeader
              label="תאריך יצירה"
              header="createdAt"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads.slice().sort((a, b) => (isAsc ? a.createdAt - b.createdAt : b.createdAt - a.createdAt))
                )
              }
            />
            <ListHeader
              label="צפיות"
              header="views"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads.slice().sort((a, b) => (isAsc ? a.views - b.views : b.views - a.views))
                )
              }
            />
            <ListHeader
              label="תגובות"
              header="comments"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) =>
                      isAsc ? a.comments.length - b.comments.length : b.comments.length - a.comments.length
                    )
                )
              }
            />
            <ListHeader
              label="תגובה אחרונה"
              header="lastComment"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) =>
                      !a.comments.length && !b.comments.length
                        ? 0
                        : a.comments.length === 0
                        ? 1
                        : b.comments.length === 0
                        ? -1
                        : isAsc
                        ? a.comments[a.comments.length - 1].createdAt - b.comments[b.comments.length - 1].createdAt
                        : b.comments[b.comments.length - 1].createdAt - a.comments[a.comments.length - 1].createdAt
                    )
                )
              }
            />
            <ListHeader
              label="תגיות"
              header="tags"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) =>
                      !a.tags.length && !b.tags.length
                        ? 0
                        : !a.tags.length
                        ? 1
                        : !b.tags.length
                        ? -1
                        : isAsc
                        ? a.tags[0].localeCompare(b.tags[0])
                        : b.tags[0].localeCompare(a.tags[0])
                    )
                )
              }
            />
          </div>
          {isPending && <div className="loading-forum">טוען דיונים...</div>}
          {error && <div className="error-forum">{error}</div>}
          {!isPending && !error && (
            <div className="threads-list-rows">
              {currentThreads.map((thread) => (
                <ThreadRow
                  key={thread._id}
                  thread={thread}
                  starred={starredThreads.includes(thread._id)}
                  setStarredThreads={setStarredThreads}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamForum;
