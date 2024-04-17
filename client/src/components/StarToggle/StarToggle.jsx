import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import "./StarToggle.css";

/**
 * A star toggle component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.threadId - The thread ID.
 * @returns {JSX.Element} The rendered StarToggle component.
 */
function StarToggle({ threadId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isPending, setIsPending] = useState(false);

  /**
   * Star the thread.
   *
   * @async
   * @function starThread
   * @returns {Promise<void>} A Promise that resolves when the thread is starred.
   */
  const starThread = async () =>
    await axiosInstance
      .post(`threads/${threadId}/star`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, starred_threads: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהוספת הדיון למועדפים, אנא נסה שנית."))
      .finally(() => setIsPending(false));

  /**
   * Unstar the thread.
   *
   * @async
   * @function unstarThread
   * @returns {Promise<void>} A Promise that resolves when the thread is unstarred.
   */
  const unstarThread = async () =>
    await axiosInstance
      .delete(`threads/${threadId}/star`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, starred_threads: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהסרת הדיון ממועדפים, אנא נסה שנית."))
      .finally(() => setIsPending(false));

  /**
   * Handle the starred change event.
   *
   * @function handleStarredChange
   * @param {Object} e - The event object.
   * @returns {void}
   */
  const handleStarredChange = (e) => {
    if (isPending) return;

    setIsPending(true);

    if (e.target.checked) {
      starThread();
    } else {
      unstarThread();
    }
  };

  return isPending ? (
    <div className="lds-dual-ring" id="loading-starred"></div>
  ) : (
    <label className="starred-checkbox">
      <input type="checkbox" onChange={handleStarredChange} checked={user.starred_threads.includes(threadId)} />
      <svg height="24px" viewBox="0 0 24 24" width="24px">
        <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
      </svg>
    </label>
  );
}

export default StarToggle;
