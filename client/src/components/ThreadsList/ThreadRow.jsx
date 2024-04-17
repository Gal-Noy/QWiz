import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { formatDate, isTextRTL } from "../../utils/generalUtils";

function ThreadRow({ thread, exam, isProfilePage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isStarredPending, setIsStarredPending] = useState(false);

  const starThread = async () =>
    await axiosInstance
      .post(`threads/${thread._id}/star`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, starred_threads: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהוספת הדיון למסומן בכוכב, אנא נסה שנית."))
      .finally(() => setIsStarredPending(false));

  const unstarThread = async () =>
    await axiosInstance
      .delete(`threads/${thread._id}/star`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, starred_threads: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהסרת הדיון מהמסומן בכוכב, אנא נסה שנית."))
      .finally(() => setIsStarredPending(false));

  const handleStarredChange = (e) => {
    if (isStarredPending) return;

    setIsStarredPending(true);

    if (e.target.checked) {
      starThread();
    } else {
      unstarThread();
    }
  };

  return (
    <div
      className={"thread-row" + (isProfilePage ? " is-profile-page" : "")}
      onClick={() => {
        window.location.href = `/thread/${thread._id}`;
      }}
    >
      <div className="table-element starred row" onClick={(e) => e.stopPropagation()}>
        {isStarredPending ? (
          <div className="lds-dual-ring" id="loading-starred"></div>
        ) : (
          <label className="starred-checkbox">
            <input type="checkbox" onChange={handleStarredChange} checked={user.starred_threads.includes(thread._id)} />
            <svg height="24px" viewBox="0 0 24 24" width="24px">
              <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
            </svg>
          </label>
        )}
      </div>
      <div className="table-element isClosed row">
        {thread.isClosed ? (
          <span className="material-symbols-outlined">lock</span>
        ) : (
          <span className="material-symbols-outlined">lock_open</span>
        )}
      </div>
      {exam && (
        <div className="table-element exam row">
          <a>
            {exam.course.name} - {exam.year}
          </a>
          <a>
            {exam.type === "test" ? "מבחן" : "בוחן"} - {exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}{" "}
            - {exam.term === 1 ? "א'" : exam.term === 2 ? "ב'" : "ג'"}
          </a>
        </div>
      )}
      <div className="table-element title">{thread.title}</div>
      <div className="table-element creator">{thread.creator.name}</div>
      <div className="table-element createdAt">{formatDate(thread.createdAt)}</div>
      <div className="table-element views row">
        <span className="material-symbols-outlined">visibility</span>
        {thread.views}
      </div>
      <div className="table-element comments row">
        <span className="material-symbols-outlined">chat_bubble_outline</span>
        {thread.comments.length}
      </div>
      <div className="table-element lastComment row">
        {thread.comments.length > 0 && <a>{thread.comments[thread.comments.length - 1].sender.name}</a>}
        {thread.comments.length > 0 && <a>{formatDate(thread.comments[thread.comments.length - 1].createdAt)}</a>}
      </div>
      <div className="table-element tags">
        {thread.tags.map((tag, index) => (
          <span className="thread-page-tag" key={index}>
            <a href={`/search/${tag}`}>
              {isTextRTL(tag) ? <span dir="rtl">#{tag}</span> : <span dir="ltr">{tag}#</span>}
            </a>
            {index !== thread.tags.length - 1 && ", "}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ThreadRow;
