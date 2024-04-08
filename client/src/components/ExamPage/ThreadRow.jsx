import React, { useState, useEffect } from "react";
import axiosInstance, { handleError } from "../../utils/axiosInstance";
import { formatDate } from "../../utils/generalUtils";
// import ExamRating from "../ExamRating";

function ThreadRow({ thread, favorite }) {
  //   const [isFavorite, setIsFavorite] = useState(favorite);

  //   const addToFavorites = async () => {
  //     await axiosInstance.post("/threads/favorites", { thread }).catch((err) => {
  //       handleError(err, () => {
  //         console.error(err.response.data.message);
  //         alert("שגיאה בהוספת הבחינה למועדפים, אנא נסה שנית.");
  //       });
  //     });
  //   };

  //   const removeFromFavorites = async () => {
  //     await axios.delete(`/threads/favorites/${thread._id}`).catch((err) => {
  //       handleError(err, () => {
  //         console.error(err.response.data.message);
  //         alert("שגיאה בהסרת הבחינה מהמועדפים, אנא נסה שנית.");
  //       });
  //     });
  //   };

  //   const handleFavoritesChange = (e) => {
  //     setIsFavorite(!isFavorite);
  //     if (e.target.checked) {
  //       addToFavorites();
  //     } else {
  //       removeFromFavorites();
  //     }
  //   };
  //
  //   useEffect(() => {
  //     setIsFavorite(favorite);
  //   }, [favorite]);
  console.log(thread);
  return (
    <div
      className="thread-row"
      onClick={() => {
        window.location.href = `/thread/${thread._id}`;
      }}
    >
      {/* <div className="table-element favorite">
        <div className="checkbox-wrapper-22">
          <label className="switch" htmlFor={`checkbox-${thread._id}`} onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" id={`checkbox-${thread._id}`} onChange={handleFavoritesChange} checked={isFavorite} />
            <div className="slider round"></div>
          </label>
        </div>
      </div> */}
      <div className="table-element isClosed">
        {thread.isClosed ? (
          <span className="material-symbols-outlined">lock</span>
        ) : (
          <span className="material-symbols-outlined">lock_open</span>
        )}
      </div>
      <div className="table-element title">{thread.title}</div>
      <div className="table-element creator">{thread.creator.name}</div>
      <div className="table-element createdAt">{formatDate(thread.createdAt)}</div>
      <div className="table-element views">
        <span className="material-symbols-outlined">visibility</span>
        {thread.views}
      </div>
      <div className="table-element comments">
        <span className="material-symbols-outlined">chat_bubble_outline</span>
        {thread.comments.length}
      </div>
      <div className="table-element lastComment">
        {thread.comments.length > 0 && <a>{thread.comments[thread.comments.length - 1].sender.name}</a>}
        {thread.comments.length > 0 && <a>{formatDate(thread.comments[thread.comments.length - 1].createdAt)}</a>}
      </div>
      <div className="table-element tags">{thread.tags}</div>
    </div>
  );
}

export default ThreadRow;
