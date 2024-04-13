import React, { useState, useEffect } from "react";
import axiosInstance, { handleResult, handleError } from "../../utils/axiosInstance";
import ExamRating from "../ExamRating/ExamRating";

function ExamRow({ exam, favorite, setFavoriteExams }) {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [isFavoritePending, setIsFavoritePending] = useState(false);

  const addToFavorites = async () => {
    setIsFavoritePending(true);
    await axiosInstance
      .post(`/exams/favorites/${exam._id}`)
      .then((res) => handleResult(res, 200, () => setFavoriteExams(res.data)))
      .then(() => setIsFavoritePending(false))
      .catch((err) => {
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בהוספת הבחינה למועדפים, אנא נסה שנית.");
        });
      });
  };

  const removeFromFavorites = async () => {
    setIsFavoritePending(true);
    await axiosInstance
      .delete(`/exams/favorites/${exam._id}`)
      .then((res) => handleResult(res, 200, () => setFavoriteExams(res.data)))
      .then(() => setIsFavoritePending(false))
      .catch((err) => {
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בהסרת הבחינה מהמועדפים, אנא נסה שנית.");
        });
      });
  };

  const handleFavoritesChange = (e) => {
    if (isFavoritePending) return;
    setIsFavorite(!isFavorite);
    if (e.target.checked) {
      addToFavorites();
    } else {
      removeFromFavorites();
    }
  };

  useEffect(() => {
    setIsFavorite(favorite);
  }, [favorite]);

  return (
    <div
      className="exam-row"
      onClick={() => {
        window.location.href = `/exam/${exam._id}`;
      }}
    >
      <div className="table-element favorite" onClick={(e) => e.stopPropagation()}>
        {isFavoritePending ? (
          <div className="lds-dual-ring" id="loading-favorite"></div>
        ) : (
          <div className="checkbox-wrapper-22">
            <label className="switch" htmlFor={`checkbox-${exam._id}`} >
              <input
                type="checkbox"
                id={`checkbox-${exam._id}`}
                onChange={handleFavoritesChange}
                checked={isFavorite}
              />
              <div className="slider round"></div>
            </label>
          </div>
        )}
      </div>
      <div className="table-element course-num">{exam.course.code}</div>
      <div className="table-element course-name">{exam.course.name}</div>
      <div className="table-element lecturers">{exam.lecturers}</div>
      <div className="table-element type">{exam.type === "test" ? "מבחן" : "בוחן"}</div>
      <div className="table-element year">{exam.year}</div>
      <div className="table-element semester">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "קיץ"}</div>
      <div className="table-element term">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}</div>
      <div className="table-element grade">{exam.grade}</div>
      <ExamRating difficultyRating={exam.difficultyRating} examId={exam._id} editMode={false} />
    </div>
  );
}

export default ExamRow;
