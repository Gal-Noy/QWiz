import React, { useState, useEffect } from "react";

function ExamsListHeader(props) {
  const { label, header, sortHeader, setSortHeader, sortFunc } = props;
  const [isSorter, setIsSorter] = useState(sortHeader === header);
  const [isAsc, setIsAsc] = useState(true);

  const handleClick = () => {
    if (isSorter) {
      setIsAsc(!isAsc);
    } else {
      setSortHeader(header);
      setIsSorter(true);
    }
  };

  useEffect(() => {
    if (isSorter) {
      sortFunc(isAsc);
    }
  }, [isSorter, isAsc]);

  useEffect(() => {
    if (sortHeader !== header) {
      setIsSorter(false);
    }
  }, [sortHeader]);

  return (
    <div className={"table-element header " + header} onClick={handleClick}>
      <a>{label}</a>
      {isSorter && isAsc && <span className="material-symbols-outlined sort-arrow">arrow_drop_down</span>}
      {isSorter && !isAsc && <span className="material-symbols-outlined sort-arrow">arrow_drop_up</span>}
    </div>
  );
}

export default ExamsListHeader;
