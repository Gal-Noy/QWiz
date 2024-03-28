import React, { useState, useEffect } from "react";

function FilterDropdown(props) {
  const { label, options, value, setValue } = props;
  const [isAvailable, setisAvailable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log(isOpen);
  return (
    <div className="filter-dropdown" onClick={() => setIsOpen(!isOpen)}>
      {value || label}
      {isOpen && (
        <div className="filter-dropdown-options">
          {options.map((option) => (
            <a
              className="filter-dropdown-item"
              key={option._id}
              onClick={() => {
                setValue(option.name);
                setIsOpen(false);
              }}
            >
              {option.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
