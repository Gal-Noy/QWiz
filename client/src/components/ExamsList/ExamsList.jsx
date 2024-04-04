import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import ExamRow from "./ExamRow";
import ExamsListHeader from "./ExamsListHeader";
import "../../styles/ExamsList.css";

function ExamsList(props) {
  const { exams, setExams, showExams, isProfilePage, isPending, error } = props;
  const [favoriteExams, setFavoriteExams] = useState([]);
  const [sortHeader, setSortHeader] = useState("favorite");

  // useEffect(() => {
  //   if (exams.length > 0) {
  //     if (prevSortHeader === sortHeader) {
  //       setSortAsc(!sortAsc);
  //     }
  //     const sortedExams = exams.sort((a, b) => {
  //       if (sortHeader === "course-num") {
  //         return a.course > b.course ? 1 : -1;
  //       } else if (sortHeader === "course-name") {
  //         return idsToCourses[a.course].name > idsToCourses[b.course].name ? 1 : -1;
  //       } else if (sortHeader === "lecturers") {
  //         return a.lecturers > b.lecturers ? 1 : -1;
  //       } else if (sortHeader === "type") {
  //         return a.type > b.type ? 1 : -1;
  //       } else if (sortHeader === "year") {
  //         return a.year > b.year ? 1 : -1;
  //       } else if (sortHeader === "semester") {
  //         return a.semester > b.semester ? 1 : -1;
  //       } else if (sortHeader === "term") {
  //         return a.term > b.term ? 1 : -1;
  //       } else if (sortHeader === "grade") {
  //         return a.grade > b.grade ? 1 : -1;
  //       } else if (sortHeader === "rank") {
  //         return a.rank > b.rank ? 1 : -1;
  //       }
  //     });
  //     setExams(sortedExams);
  //   }
  // }, [sortHeader]);

  useEffect(() => {
    if (showExams) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/exams/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const favoriteExamsIds = res.data.map((exam) => exam._id);
            setFavoriteExams(favoriteExamsIds);
          }
        })
        .catch((err) => {
          handleError(err, () => {
            console.error(err.response.data.message);
            alert("שגיאה בטעינת הבחינות המועדפות, אנא נסה שנית.");
          });
        });
    }
  }, [showExams]);

  return !showExams ? null : (
    <div className="exams-list">
      <label className="exams-list-count">סה"כ בחינות נמצאו: {exams.length}</label>
      <div className={"exams-list-container" + (isProfilePage ? " is-profile-page" : "")}>
        <div className="headers-row">
          <ExamsListHeader
            label="מועדפים"
            header="favorite"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams.slice().sort((a, b) => (favoriteExams.includes(a._id) ? -1 : 1) * (isAsc ? 1 : -1))
              )
            }
          />
          <ExamsListHeader
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
          <ExamsListHeader
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
          <ExamsListHeader
            label="מרצים"
            header="lecturers"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) =>
                prevExams.slice().sort((a, b) => (a.lecturers > b.lecturers ? 1 : -1) * (isAsc ? 1 : -1))
              )
            }
          />
          <ExamsListHeader
            label="סוג בחינה"
            header="type"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.type > b.type ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ExamsListHeader
            label="שנה"
            header="year"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.year > b.year ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ExamsListHeader
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
          <ExamsListHeader
            label="מועד"
            header="term"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.term > b.term ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ExamsListHeader
            label="ציון"
            header="grade"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.grade > b.grade ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
          <ExamsListHeader
            label="דירוג"
            header="rank"
            sortHeader={sortHeader}
            setSortHeader={setSortHeader}
            sortFunc={(isAsc) =>
              setExams((prevExams) => prevExams.slice().sort((a, b) => (a.rank > b.rank ? 1 : -1) * (isAsc ? 1 : -1)))
            }
          />
        </div>
        {isPending && !error && <div className="exams-list-loading">טוען...</div>}
        {error && <div className="exams-list-error">{error}</div>}
        {!isPending && !error && (
          <div className="exams-list-rows">
            {exams.map((exam) => (
              <ExamRow key={exam._id} exam={exam} favorite={favoriteExams.includes(exam._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamsList;
