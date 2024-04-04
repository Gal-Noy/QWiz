import React, { useState, useEffect } from "react";

function FilterDropdown(props) {
  const { index, label, options, value, setValue, isAvailable } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const valueChosen = value ? true : false;

  useEffect(() => {
    if (searchInput) {
      const filteredOptions = options.filter((option) => option.name.includes(searchInput));
      setFilteredOptions(filteredOptions);
    }
  }, [searchInput]);

  return (
    <div
      className={"filter-dropdown" + (!isAvailable ? " disabled" : "") + (valueChosen ? " chosen" : "")}
      onMouseEnter={() => {
        if (isAvailable) {
          setIsOpen(true);
          document.getElementById(`filter-dropdown-search-input-${index}`).focus();
        }
      }}
      onMouseLeave={() => {
        if (isAvailable) {
          setIsOpen(false);
          setSearchInput("");
          document.getElementById(`filter-dropdown-search-input-${index}`).blur();
        }
      }}
    >
      <input
        className="filter-dropdown-search-input"
        id={"filter-dropdown-search-input-" + index}
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {value?.name || label}
      {isOpen && (
        <div className="filter-dropdown-options">
          {searchInput &&
            filteredOptions.map((option, index) =>
              option !== "" ? (
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
              ) : null
            )}
          {!searchInput &&
            options.map((option, index) =>
              option !== "" ? (
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
              ) : null
            )}
        </div>
      )}
      {valueChosen && (
        <span className="material-symbols-outlined filter-dropdown-clear" onClick={() => setValue(null)}>
          close
        </span>
      )}
    </div>
  );
}

export default FilterDropdown;
