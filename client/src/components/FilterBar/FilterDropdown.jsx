import React, { useState, useEffect } from "react";

function FilterDropdown(props) {
  const { label, options, value, setValue, isAvailable } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={"filter-dropdown" + (!isAvailable ? " disabled" : "")}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {value.name || value || label}
      {isOpen && (
        <div className="filter-dropdown-options">
          {options.map((option, index) => (
            <a
              className="filter-dropdown-item"
              key={option._id || index}
              onClick={() => {
                setValue(option);
                setIsOpen(false);
              }}
            >
              {option.name || option}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
