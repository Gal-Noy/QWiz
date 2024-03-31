import React, { useState } from "react";

function HomePageInfoBlock({ title, explanation, id }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={"qwiz-main-block" + (isHovered ? " hovered" : "")}
      id={"qwiz-main-block-" + id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block-title">{title}</div>
      <div className="block-explanation">{explanation}</div>
    </div>
  );
}

export default HomePageInfoBlock;
