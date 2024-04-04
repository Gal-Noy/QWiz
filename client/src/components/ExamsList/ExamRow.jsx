import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import ExamRating from "./ExamRating";

function ExamRow({ exam, favorite }) {
  const [isFavorite, setIsFavorite] = useState(favorite);

  const addToFavorites = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/exams/favorites`,
        { exam },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .catch((err) => {
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בהוספת הבחינה למועדפים, אנא נסה שנית.");
        });
      });
  };

  const removeFromFavorites = () => {
    axios
      .delete(`${import.meta.env.VITE_SERVER_URL}/exams/favorites/${exam._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .catch((err) => {
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בהסרת הבחינה מהמועדפים, אנא נסה שנית.");
        });
      });
  };

  const handleFavoritesChange = (e) => {
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
    <div className="exam-row">
      <div className="table-element favorite">
        <div className="checkbox-wrapper-22">
          <label className="switch" htmlFor={`checkbox-${exam._id}`}>
            <input type="checkbox" id={`checkbox-${exam._id}`} onChange={handleFavoritesChange} checked={isFavorite} />
            <div className="slider round"></div>
          </label>
        </div>
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
