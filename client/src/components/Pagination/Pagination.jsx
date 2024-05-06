import React from "react";
import "./Pagination.css";

/**
 * Renders a pagination component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.numPages - The total number of pages.
 * @param {number} props.currentPage - The current page number.
 * @param {Function} props.setCurrentPage - The function to set the current page number.
 * @param {boolean} props.dataExists - Indicates whether data exists.
 * @returns {JSX.Element} The rendered Pagination component.
 */
function Pagination(props) {
  const { numPages, currentPage, setCurrentPage, dataExists } = props;

  return (
    <div className="pagination">
      <span
        className={"material-symbols-outlined navigation-arrow" + (currentPage > 1 ? " enabled" : "")}
        onClick={() => {
          if (currentPage > 1) setCurrentPage(currentPage - 1);
        }}
      >
        arrow_forward_ios
      </span>
      {numPages} / {dataExists ? currentPage : 0}
      <span
        className={"material-symbols-outlined navigation-arrow" + (currentPage < numPages ? " enabled" : "")}
        onClick={() => {
          if (currentPage < numPages) setCurrentPage(currentPage + 1);
        }}
      >
        arrow_back_ios
      </span>
    </div>
  );
}

export default Pagination;
