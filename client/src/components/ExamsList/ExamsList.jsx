import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { calcAvgRating } from "../../utils/generalUtils";
import ExamRow from "./ExamRow";
import ListHeader from "../ListHeader/ListHeader";
import "./ExamsList.css";

function ExamsList(props) {
  const { exams, setExams, showExams, isProfilePage, isPending, error } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  const [sortHeader, setSortHeader] = useState("");
  const [numPages, setNumPages] = useState(exams.length > 0 ? Math.ceil(exams.length / 10) : 0);
  const [currentPage, setCurrentPage] = useState(1);

  const examsPerPage = 10;
  const lastExamIndex = currentPage * examsPerPage;
  const firstExamIndex = lastExamIndex - examsPerPage;
  const currentExams = exams.slice(firstExamIndex, lastExamIndex);

  useEffect(() => {
    if (showExams) {
      axiosInstance
        .get("/exams/favorites")
        .then((res) =>
          handleResult(res, 200, () => {
            const favoriteExamsIds = res.data.map((exam) => exam._id);
            localStorage.setItem("user", JSON.stringify({ ...user, favorite_exams: favoriteExamsIds }));
          })
        )
        .catch((err) => handleError(err, "שגיאה בטעינת הבחינות המועדפות."));
    }
  }, []);

  useEffect(() => {
    if (showExams) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [showExams]);

  useEffect(() => {
    if (showExams) {
      setNumPages(Math.ceil(exams.length / examsPerPage));
    }
  }, [exams]);

  return !showExams ? null : (
    <div className="exams-list">
      <label className="exams-list-count">סה"כ בחינות נמצאו: {exams.length}</label>
      {!isPending && !error && numPages > 1 && (
        <div className="exams-list-pagination">
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
      <div className={"exams-list-container" + (isProfilePage ? " is-profile-page" : "")}>
        <div className="exams-list-headers-row">
          <ListHeader
            label="מועדפים"
            header="favorite"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams.slice().sort((a, b) => (user.favorite_exams.includes(a._id) ? -1 : 1) * (isAsc ? 1 : -1))
              )
            }
          />
          <ListHeader
            label="מספר קורס"
            header="course-num"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams.slice().sort((a, b) => (a.course.code > b.course.code ? 1 : -1) * (isAsc ? 1 : -1))
              )
            }
          />
          <ListHeader
            label="שם הקורס"
            header="course-name"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams
                  .slice()
                  .sort(
                    (a, b) =>
                      a.course.name.localeCompare(b.course.name, "he", { sensitivity: "base" }) * (isAsc ? 1 : -1)
                  )
              )
            }
          />
          <ListHeader
            label="מרצים"
            header="lecturers"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams
                  .slice()
                  .sort((a, b) =>
                    !a.lecturers.length && !b.lecturers.length
                      ? 0
                      : !a.lecturers.length
                      ? 1
                      : !b.lecturers.length
                      ? -1
                      : isAsc
                      ? a.lecturers[0].localeCompare(b.lecturers[0])
                      : b.lecturers[0].localeCompare(a.lecturers[0])
                  )
              )
            }
          />
          <ListHeader
            label="סוג בחינה"
            header="type"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.type > b.type ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ListHeader
            label="שנה"
            header="year"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.year > b.year ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ListHeader
            label="סמסטר"
            header="semester"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams.slice().sort((a, b) => (a.semester > b.semester ? 1 : -1) * (isAsc ? 1 : -1))
              )
            }
          />
          <ListHeader
            label="מועד"
            header="term"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.term > b.term ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ListHeader
            label="ציון"
            header="grade"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.grade > b.grade ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ListHeader
            label="דירוג קושי"
            header="rate"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams
                  .slice()
                  .sort((a, b) =>
                    a.difficultyRatings.length === 0 && b.difficultyRatings.length === 0
                      ? 0
                      : a.difficultyRatings.length === 0
                      ? 1
                      : b.difficultyRatings.length === 0
                      ? -1
                      : (isAsc ? 1 : -1) * (calcAvgRating(a.difficultyRatings) - calcAvgRating(b.difficultyRatings))
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
              setExams((prevExams) =>
                prevExams
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
        {isPending && !error && <div className="lds-dual-ring" id="exams-loading"></div>}
        {error && <div className="exams-list-error">{error}</div>}

        {!isPending && !error && (
          <div className="exams-list-rows">
            {currentExams.map((exam) => (
              <ExamRow key={exam._id} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamsList;
