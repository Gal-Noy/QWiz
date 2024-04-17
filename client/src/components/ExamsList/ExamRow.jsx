import React, { useState } from "react";
import axiosInstance, { handleResult, handleError } from "../../utils/axiosInstance";
import ExamRating from "../ExamRating/ExamRating";

function ExamRow({ exam, isProfilePage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isFavoritePending, setIsFavoritePending] = useState(false);

  const addToFavorites = async () =>
    await axiosInstance
      .post(`/exams/favorites/${exam._id}`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, favorite_exams: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהוספת הבחינה למועדפים, אנא נסה שנית."))
      .finally(() => setIsFavoritePending(false));

  const removeFromFavorites = async () =>
    await axiosInstance
      .delete(`/exams/favorites/${exam._id}`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, favorite_exams: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהסרת הבחינה מהמועדפים, אנא נסה שנית."))
      .finally(() => setIsFavoritePending(false));

  const handleFavoritesChange = (e) => {
    if (isFavoritePending) return;

    setIsFavoritePending(true);

    if (e.target.checked) {
      addToFavorites();
    } else {
      removeFromFavorites();
    }
  };

  return (
    <div
      className={"exam-row" + (isProfilePage ? " is-profile-page" : "")}
      onClick={() => {
        window.location.href = `/exam/${exam._id}`;
      }}
    >
      <div className="table-element favorite" onClick={(e) => e.stopPropagation()}>
        {isFavoritePending ? (
          <div className="lds-dual-ring" id="loading-favorite"></div>
        ) : (
          <div className="checkbox-wrapper-22">
            <label className="switch" htmlFor={`checkbox-${exam._id}`}>
              <input
                type="checkbox"
                id={`checkbox-${exam._id}`}
                onChange={handleFavoritesChange}
                checked={user.favorite_exams.includes(exam._id)}
              />
              <div className="slider round"></div>
            </label>
          </div>
        )}
      </div>
      <div className="table-element course-num">{exam.course.code}</div>
      <div className="table-element course-name">{exam.course.name}</div>
      <div className="table-element lecturers">{exam.lecturers.join(", ")}</div>
      <div className="table-element type">{exam.type === "test" ? "מבחן" : "בוחן"}</div>
      <div className="table-element year">{exam.year}</div>
      <div className="table-element semester">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "קיץ"}</div>
      <div className="table-element term">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}</div>
      <div className="table-element grade">{exam.grade}</div>
      <ExamRating exam={exam} editMode={false}/>
      <div className="table-element tags">{exam.tags.map((t) => `#${t}`).join(", ")}</div>
    </div>
  );
}

export default ExamRow;
