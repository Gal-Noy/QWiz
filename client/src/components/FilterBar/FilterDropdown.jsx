import React, { useState, useEffect } from "react";

function FilterDropdown(props) {
  const { label, options, value, setValue, isAvailable } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const valueChosen = value ? true : false;

  useEffect(() => {
    if (searchInput) {
      const filteredOptions = options.filter((option) => option.name.includes(searchInput));
      setFilteredOptions(filteredOptions);
    } else {
      setFilteredOptions(options);
    }
  }, [searchInput]);

  return (
    <div
      className={
        "filter-dropdown l" +
        (!isAvailable ? " disabled" : "") +
        (valueChosen ? " chosen" : "") +
        (isOpen ? " show" : "")
      }
    >
      <div
        className="filter-dropdown-header"
        onClick={() => {
          if (isAvailable) setIsOpen(!isOpen);
        }}
      >
        <a className="filter-dropown-label">{value?.name || label}</a>
        <span className="material-symbols-outlined filter-dropdown-arrow">expand_more</span>
      </div>

      <div className={"filter-dropdown-menu-open" + (isOpen ? " show" : "")}>
        <input
          className="filter-dropdown-search-input"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="חיפוש..."
        />
        <ul className="filter-dropdown-options">
          {searchInput &&
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="filter-dropdown-option"
                onClick={() => {
                  setValue(option);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </li>
            ))}
          {!searchInput &&
            options.map((option, index) => (
              <li
                key={index}
                className="filter-dropdown-option"
                onClick={() => {
                  setValue(option);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default FilterDropdown;
