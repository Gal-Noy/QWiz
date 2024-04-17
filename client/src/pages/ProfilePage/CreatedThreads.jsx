import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import ThreadsList from "../../components/ThreadsList/ThreadsList";

/**
 * The created threads component.
 *
 * @component
 * @returns {JSX.Element} The rendered CreatedThreads component.
 */
function CreatedThreads() {
  const [createdThreads, setCreatedThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the threads created by the user.
   *
   * @async
   * @function fetchThreads
   * @returns {Promise<void>} The result of the threads fetch.
   */
  const fetchThreads = async () => {
    setIsPending(true);
    await axiosInstance
      .get("/threads/created")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThreads = res.data;
          setCreatedThreads(fetchedThreads);
        })
      )
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הדיונים שנוצרו, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  };

  // Initial fetch
  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <ThreadsList
      threads={createdThreads}
      setThreads={setCreatedThreads}
      isProfilePage={true}
      isPending={isPending}
      error={error}
    />
  );
}

export default CreatedThreads;
