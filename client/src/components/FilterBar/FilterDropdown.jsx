import React, { useState, useEffect, useRef } from "react";
import { handleClickOutside } from "../../utils/generalUtils";
import "./FilterBar.css";

function FilterDropdown(props) {
  const { label, options, setOptions, value, setValue, isAvailable, size, isPending, isSearchable, isMultiChoice } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const valueChosen = isMultiChoice ? value.length > 0 : !!value;
  const dropdownRef = useRef(null);

  useEffect(() => {
    handleClickOutside(dropdownRef, () => setIsOpen(false));
  }, [isOpen]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const filteredOptions = options.filter((option) =>
      option.name ? option.name.includes(searchInput) : option.toString().includes(searchInput)
    );
    setFilteredOptions(filteredOptions);
  }, [searchInput]);

  useEffect(() => {
    if (!isAvailable) {
      setSearchInput("");
      setValue(isMultiChoice ? [] : null);
      setIsOpen(false);
    }
  }, [isAvailable]);

  useEffect(() => {
    if (isMultiChoice) {
      setOptions(
        [...options].sort((a, b) =>
          value.includes(a) && !value.includes(b) ? -1 : !value.includes(a) && value.includes(b) ? 1 : 0
        )
      );
    }
  }, [value]);

  const handleSelectOption = (option) => {
    if (isMultiChoice) {
      if (!value.includes(option)) {
        setValue([...value, option]);
      } else {
        setValue(value.filter((valueObj) => valueObj !== option));
      }
    } else {
      setValue(option);
      setIsOpen(false);
    }
  };

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
          <a className="filter-dropown-label">
            {isMultiChoice && (value.length === 0 ? label : value.join(", "))}
            {!isMultiChoice && (value ? value.name || value : label)}
          </a>
        )}
        <div className="filter-dropdown-header-buttons">
          {valueChosen && (
            <span
              className="material-symbols-outlined filter-dropdown-clear"
              onClick={() => setValue(isMultiChoice ? [] : null)}
            >
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
          {filteredOptions.map((option, index) => (
            <li key={index} className="filter-dropdown-option" onClick={() => handleSelectOption(option)}>
              {isMultiChoice && (
                <input
                  className="filter-dropdown-value-checkbox"
                  type="checkbox"
                  checked={value.includes(option)}
                  readOnly
                />
              )}
              {option.name || option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilterDropdown;
