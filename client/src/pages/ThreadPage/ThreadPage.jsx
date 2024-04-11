import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import CommentBox from "./CommentBox";
import NewComment from "./NewComment";
import { examToString, sumComments } from "../../utils/generalUtils";
import "./ThreadPage.css";

function ThreadPage() {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (!threadId) return;
    setIsPending(true);
    axiosInstance
      .get(`/threads/${threadId}`)
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThread = res.data;
          setThread(fetchedThread);
          setReplyingTo(null);
          setIsPending(false);
        })
      )
      .catch((err) =>
        handleError(err, () => {
          setError("אירעה שגיאה בעת טעינת הדיון");
          setIsPending(false);
        })
      );
  }, [threadId]);

  const addComment = () => {
    if (!newComment) {
      alert("אנא הכנס/י תוכן לתגובה");
      return;
    }

    if (!replyingTo) {
      axiosInstance
        .post(`/threads/${threadId}/comment`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            alert("התגובה נוספה בהצלחה");
            window.location.reload();
          })
        )
        .catch((err) => handleError(err, () => alert("הוספת התגובה נכשלה")));
    } else {
      axiosInstance
        .post(`/threads/${threadId}/comment/${replyingTo}/reply`, { content: newComment })
        .then((res) =>
          handleResult(res, 201, () => {
            alert("התגובה נוספה בהצלחה");
            window.location.reload();
          })
        )
        .catch((err) => handleError(err, () => alert("הוספת התגובה נכשלה")));
    }
  };

  return (
    <div className="thread-page">
      {isPending && <div className="thread-page-loading">טוען דיון...</div>}
      {error && <div className="thread-page-error">{error}</div>}

      {!isPending && !error && thread && (
        <div className="thread-page-content">
          <div className="thread-page-header">
            <div className="thread-page-exam-details">{examToString(thread.exam)}</div>
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
          </div>

          <div className="thread-comment-list">
            {thread.comments.map((comment) => (
              <CommentBox
                key={comment._id}
                comment={comment}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                newComment={newComment}
                setNewComment={setNewComment}
                addComment={addComment}
                nest={0}
              />
            ))}

            {!replyingTo && (
              <NewComment
                replyingTo={null}
                setReplyingTo={setReplyingTo}
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
