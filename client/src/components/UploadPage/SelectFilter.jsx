import React, { useState } from "react";
import "../../styles/SelectFilter.css";

const SelectFilter = (props) => {
  const { options, onChange, placeholder, value } = props;
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="select-filter-div">
      <div className="select-filter-search-value" onClick={() => setShowOptions(!showOptions)}>
        <input
          placeholder={placeholder}
          className="select-search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className={"select-filter-select" + (showOptions ? " show" : "")}>
        <ul className="select-filter-options">
          {options.map((option, index) => (
            <li
              className="select-filter-option"
              key={index}
              onClick={() => {
                onChange(option.value);
                setShowOptions(false);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectFilter;
