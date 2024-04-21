import React, { useState, useEffect } from "react";

/**
 * A header component used for sorting a list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label of the header.
 * @param {string} props.header - The header name.
 * @param {string} props.sortHeader - The header used for sorting.
 * @param {boolean} props.isAsc - Indicates whether the sorting order is ascending.
 * @param {Function} props.handleSortClick - The function to handle the sort click.
 * @returns {JSX.Element} The rendered ListHeader component.
 */
function ListHeader(props) {
  const { label, header, sortHeader, isAsc, handleSortClick } = props;

  const [isSorter, setIsSorter] = useState(sortHeader === header);

  // Reset the sorter when the sort header changes
  useEffect(() => {
    setIsSorter(sortHeader === header);
  }, [sortHeader]);

  return (
    <div className={"table-element header " + header + (isSorter ? " is-sorter" : "")} onClick={handleSortClick}>
      <a>{label}</a>
      {isSorter && isAsc && <span className="material-symbols-outlined sort-arrow">arrow_drop_down</span>}
      {isSorter && !isAsc && <span className="material-symbols-outlined sort-arrow">arrow_drop_up</span>}
    </div>
  );
}

export default ListHeader;
