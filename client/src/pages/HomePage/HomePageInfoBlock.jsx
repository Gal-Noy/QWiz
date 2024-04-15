import React from "react";

function HomePageInfoBlock({ title, explanation, id }) {
  return (
    <div className="homepage-main-block" id={"homepage-main-block-" + id}>
      <div className="block-title">{title}</div>
      <div className="block-explanation">{explanation}</div>
    </div>
  );
}

export default HomePageInfoBlock;
