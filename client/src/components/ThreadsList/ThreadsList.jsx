import React, { useState, useEffect } from "react";
import ListHeader from "../ListHeader/ListHeader";
import ThreadRow from "./ThreadRow";
import "./ThreadsList.css";

/**
 * A list of threads component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.threads - The threads to display.
 * @param {Function} props.setThreads - The function to update the threads.
 * @param {boolean} props.isProfilePage - Indicates if the list is on the profile page.
 * @param {boolean} props.isPending - Indicates if the threads are pending.
 * @param {string} props.error - The error message, if any.
 * @returns {JSX.Element} The rendered ThreadsList component.
 */
function ThreadsList(props) {
  const { threads, setThreads, isProfilePage, isPending, error } = props;

  const starredThreads = JSON.parse(localStorage.getItem("user")).starred_threads;
  const [sortHeader, setSortHeader] = useState("");

  // Pagination
  const [numPages, setNumPages] = useState(threads.length > 0 ? Math.ceil(threads.length / 10) : 0);
  const [currentPage, setCurrentPage] = useState(1);
  const threadsPerPage = 10;
  const lastThreadIndex = currentPage * threadsPerPage;
  const firstThreadIndex = lastThreadIndex - threadsPerPage;
  const currentThreads = threads.slice(firstThreadIndex, lastThreadIndex);

  useEffect(() => {
    setNumPages(Math.ceil(threads.length / threadsPerPage));
  }, [threads]);

  return (
    <div className={"threads-list" + (isProfilePage ? " is-profile-page" : "")}>
      <label className="threads-list-count">סה"כ דיונים נמצאו: {threads.length}</label>
      {!isPending && !error && numPages > 1 && (
        <div className="threads-list-pagination">
          {/* Pagination */}
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
      <div className={"threads-list-container" + (isProfilePage ? " is-profile-page" : "")}>
        <div className={"threads-list-headers-row" + (isProfilePage ? " is-profile-page" : "")}>
          {/* Headers */}
          <ListHeader
            label="מועדפים"
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
          {isProfilePage && (
            <ListHeader
              label="פרטי בחינה"
              header="exam"
              sortHeader={sortHeader}
              setSortHeader={setSortHeader}
              sortFunc={(isAsc) =>
                setThreads((prevThreads) =>
                  prevThreads
                    .slice()
                    .sort((a, b) =>
                      isAsc
                        ? a.exam.course.name.localeCompare(b.exam.course.name)
                        : b.exam.course.name.localeCompare(a.exam.course.name)
                    )
                )
              }
            />
          )}
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
                    isAsc ? a.creator.name.localeCompare(b.creator.name) : b.creator.name.localeCompare(a.creator.name)
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
                prevThreads
                  .slice()
                  .sort((a, b) =>
                    isAsc
                      ? new Date(a.createdAt) - new Date(b.createdAt)
                      : new Date(b.createdAt) - new Date(a.createdAt)
                  )
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
                      ? new Date(a.comments[a.comments.length - 1].createdAt) -
                        new Date(b.comments[b.comments.length - 1].createdAt)
                      : new Date(b.comments[b.comments.length - 1].createdAt) -
                        new Date(a.comments[a.comments.length - 1].createdAt)
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
        {isPending && !error && <div className="lds-dual-ring" id="threads-loading"></div>}
        {error && <div className="threads-list-error">{error}</div>}
        {!isPending && !error && (
          <div className="threads-list-rows">
            {currentThreads.map((thread) => (
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
    </div>
  );
}

export default ThreadsList;
