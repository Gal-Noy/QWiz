import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import CommentBox from "./CommentBox";
import NewComment from "./NewComment";
import { examToString, sumComments } from "../../utils/generalUtils";
import "./ThreadPage.css";

function ThreadPage() {
  const { threadId, commentId } = useParams();
  const [thread, setThread] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currReplied, setCurrReplied] = useState(null);
  const [expandAll, setExpandAll] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isClosedPending, setIsClosedPending] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && thread?.creator._id === user._id;

  if (commentId) {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) commentElement.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!threadId) return;

    setIsPending(true);

    axiosInstance
      .get(`/threads/${threadId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThread = res.data;
          setThread(fetchedThread);
          setCurrReplied(null);
        })
      )
      .catch((err) => handleError(err, null, () => setError("אירעה שגיאה בעת טעינת הדיון")))
      .finally(() => setIsPending(false));
  }, [threadId]);

  const toggleThreadClosed = async () => {
    if (isClosedPending) return;
    setIsClosedPending(true);
    await axiosInstance
      .post(`/threads/${threadId}/toggle`)
      .then((res) => handleResult(res, 200, () => setThread(res.data)))
      .catch((err) => handleError(err, "שגיאה בשינוי סטטוס הדיון"))
      .finally(() => setIsClosedPending(false));
  };

  useEffect(() => {
    if (thread) setIsClosed(thread.isClosed);
  }, [thread]);

  const addComment = async (setIsPendingCallback) => {
    if (isClosed) {
      alert("הדיון נעול ולא ניתן להוסיף תגובות");
      return;
    }

    if (!newComment) {
      alert("אנא הכנס/י תוכן לתגובה");
      return;
    }

    setIsPendingCallback(true);

    if (!currReplied) {
      await axiosInstance
        .post(`/threads/${threadId}/comment`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            alert("התגובה נוספה בהצלחה");
            window.location.reload();
          })
        )
        .catch((err) => handleError(err, "הוספת התגובה נכשלה"))
        .finally(() => setIsPendingCallback(false));
    } else {
      await axiosInstance
        .post(`/threads/${threadId}/comment/${currReplied}/reply`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            alert("התגובה נוספה בהצלחה");
            window.location.reload();
          })
        )
        .catch((err) => handleError(err, "הוספת התגובה נכשלה"))
        .finally(() => setIsPendingCallback(false));
    }
  };

  return (
    <div className="thread-page">
      {isPending && <div className="lds-dual-ring" id="thread-page-loading"></div>}
      {error && <div className="thread-page-error">{error}</div>}

      {!isPending && !error && thread && (
        <div className="thread-page-content">
          <div className="thread-page-header">
            <div className="thread-page-exam-details">
              {isClosed ? <span className="material-symbols-outlined">lock</span> : ""}
              {examToString(thread.exam)}
            </div>
            <div className="thread-page-views-and-comments">
              <div className="thread-page-views">
                {thread.views} <span className="material-symbols-outlined">visibility</span>
              </div>
              <div className="thread-page-comments">
                {sumComments(thread.comments)} <span className="material-symbols-outlined">chat_bubble_outline</span>
              </div>
            </div>
            <button className="go-to-exam-button" onClick={() => (window.location.href = `/exam/${thread.exam._id}`)}>
              לעמוד המבחן
            </button>
            <div className="thread-page-tags">
              {thread.tags.map((tag, index) => (
                <span className="thread-page-tag" key={index}>
                  #<a href={`/search/${tag}`}>{tag}</a>
                </span>
              ))}
            </div>
            <div className="thread-header-bottom-buttons">
              <button className="thread-header-bottom-button" onClick={() => setExpandAll(!expandAll)}>
                {expandAll ? "כווץ הכל" : "הרחב הכל"}
              </button>
              {isAdmin && (
                <button className="thread-header-bottom-button" onClick={toggleThreadClosed}>
                  {isClosedPending && <div className="lds-dual-ring" id="isClosed-loading"></div>}
                  {!isClosedPending && (isClosed ? "פתח דיון" : "נעל דיון")}
                </button>
              )}
            </div>
          </div>

          <div className="thread-comment-list">
            {thread.comments.map((comment) => (
              <CommentBox
                key={comment._id}
                threadId={threadId}
                comment={comment}
                currReplied={currReplied}
                setCurrReplied={setCurrReplied}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
                nest={0}
                expand={expandAll}
                isClosed={isClosed}
                replyTo={thread.comments[0]._id} // reply to the first comment
              />
            ))}

            {!isClosed && !currReplied && (
              <NewComment
                currReplied={null}
                setCurrReplied={setCurrReplied}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadPage;
