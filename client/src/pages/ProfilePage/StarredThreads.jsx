import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import ThreadsList from "../../components/ThreadsList/ThreadsList";

/**
 * The starred threads component.
 *
 * @component
 * @returns {JSX.Element} The rendered StarredThreads component.
 */
function StarredThreads() {
  const [starredThreads, setStarredThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the starred threads.
   *
   * @async
   * @function fetchStarredThreads
   * @returns {Promise<void>} The result of the axios request.
   */
  const fetchStarredThreads = async () => {
    setIsPending(true);
    await axiosInstance
      .get("/threads/starred")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThreads = res.data;
          const sortedThreads = fetchedThreads.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1));
          setStarredThreads(sortedThreads);
        })
      )
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הדיונים המועדפים, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  };

  // Initial fetch
  useEffect(() => {
    fetchStarredThreads();
  }, []);

  return (
    <ThreadsList
      threads={starredThreads}
      setThreads={setStarredThreads}
      showThreads={true}
      isProfilePage={true}
      isPending={isPending}
      error={error}
    />
  );
}

export default StarredThreads;
