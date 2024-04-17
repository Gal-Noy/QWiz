import React from "react";

/**
 * The home page info block component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the block.
 * @param {string} props.explanation - The explanation of the block.
 * @param {number} props.id - The block id.
 * @returns {JSX.Element} The rendered HomePageInfoBlock component.
 */
function HomePageInfoBlock(props) {
  const { title, explanation, id } = props;

  return (
    <div className="homepage-main-block" id={"homepage-main-block-" + id}>
      <div className="block-title">{title}</div>
      <div className="block-explanation">{explanation}</div>
    </div>
  );
}

export default HomePageInfoBlock;
