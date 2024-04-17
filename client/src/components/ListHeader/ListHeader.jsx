import React, { useState, useEffect } from "react";

/**
 * A header component used for sorting a list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the header.
 * @param {string} props.header - The header for the list.
 * @param {string} props.sortHeader - The header used for sorting.
 * @param {Function} props.setSortHeader - The function to update the sort header.
 * @param {Function} props.sortFunc - The function to sort the list.
 * @returns {JSX.Element} The rendered ListHeader component.
 */
function ListHeader(props) {
  const { label, header, sortHeader, setSortHeader, sortFunc } = props;

  const [isSorter, setIsSorter] = useState(sortHeader === header);
  const [isAsc, setIsAsc] = useState(true); // Ascending order by default

  /**
   * Handle the click event.
   *
   * @function handleClick
   * @returns {void}
   */
  const handleClick = () => {
    if (isSorter) {
      setIsAsc(!isAsc);
    } else {
      setSortHeader(header);
      setIsSorter(true);
    }
  };

  // Sort the list when the sorter is active
  useEffect(() => {
    if (isSorter) {
      sortFunc(isAsc);
    }
  }, [isSorter, isAsc]);

  // Reset the sorter when the sort header changes
  useEffect(() => {
    if (sortHeader !== header) {
      setIsSorter(false);
    }
  }, [sortHeader]);

  return (
    <div className={"table-element header " + header + (isSorter ? " is-sorter" : "")} onClick={handleClick}>
      <a>{label}</a>
      {isSorter && isAsc && <span className="material-symbols-outlined sort-arrow">arrow_drop_down</span>}
      {isSorter && !isAsc && <span className="material-symbols-outlined sort-arrow">arrow_drop_up</span>}
    </div>
  );
}

export default ListHeader;
