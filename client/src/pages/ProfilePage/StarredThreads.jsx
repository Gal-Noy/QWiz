import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
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

  useEffect(() => {
    axiosInstance
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
