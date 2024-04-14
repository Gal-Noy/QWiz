import React, { useState, useEffect, useRef } from "react";
import "./FilterBar.css";

function FilterDropdown(props) {
  const { label, options, value, setValue, isAvailable, size, isPending, isSearchable } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const valueChosen = value ? true : false;
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchInput) {
      const filteredOptions = options.filter((option) => option.name.includes(searchInput));
      setFilteredOptions(filteredOptions);
    } else {
      setFilteredOptions(options);
    }
  }, [searchInput, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isAvailable) {
      setSearchInput("");
      setIsOpen(false);
    }
  }, [isAvailable]);

  return (
    <div
      ref={dropdownRef}
      className={
        `filter-dropdown ${size}` +
        (!isAvailable ? " disabled" : "") +
        (valueChosen ? " chosen" : "") +
        (isOpen ? " show" : "") +
        (isPending ? " pending" : "")
      }
    >
      <div
        className="filter-dropdown-header"
        onClick={() => {
          if (isAvailable) setIsOpen(!isOpen);
        }}
      >
        {isPending ? (
          <div className="lds-dual-ring" id="filter-dropdown-loading"></div>
        ) : (
          <a className="filter-dropown-label">{value?.name || value || label}</a>
        )}
        <div className="filter-dropdown-header-buttons">
          {valueChosen && (
            <span className="material-symbols-outlined filter-dropdown-clear" onClick={() => setValue(null)}>
              clear
            </span>
          )}
          <span className="material-symbols-outlined filter-dropdown-arrow">expand_more</span>
        </div>
      </div>

      <div className={"filter-dropdown-menu-open" + (isOpen ? " show" : "")}>
        {isSearchable && (
          <input
            className="filter-dropdown-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="חיפוש..."
          />
        )}
        <ul className="filter-dropdown-options">
          {searchInput &&
            filteredOptions.map((option, index) =>
              option.name != "" ? (
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
              ) : null
            )}
          {!searchInput &&
            options.map((option, index) =>
              option != "" && option?.name != "" ? (
                <li
                  key={index}
                  className="filter-dropdown-option"
                  onClick={() => {
                    setValue(option);
                    setIsOpen(false);
                  }}
                >
                  {option.name || option}
                </li>
              ) : null
            )}
        </ul>
      </div>
    </div>
  );
}

export default FilterDropdown;
