import React from "react";
import "./Pagination.css";

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