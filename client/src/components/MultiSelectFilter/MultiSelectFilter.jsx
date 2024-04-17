import React, { useState, useEffect, useRef } from "react";
import { handleClickOutside } from "../../utils/generalUtils";
import "../MultiSelectFilter/MultiSelectFilter.css";

/**
 * A multi-select filter component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.options - The available options for the filter.
 * @param {Function} props.setOptions - The function to update the options.
 * @param {Array} props.list - The selected options for the filter.
 * @param {Function} props.setList - The function to update the selected options.
 * @param {string} props.placeholder - The placeholder for the filter.
 * @param {boolean} props.dependency - The dependency for the filter.
 * @param {boolean} props.isPending - Indicates if the filter is in a pending state.
 * @param {boolean} props.newThreadPage - Indicates if the filter is on the new thread page.
 * @returns {JSX.Element} The rendered MultiSelectFilter component.
 */
function MultiSelectFilter(props) {
  const { options, setOptions, list, setList, placeholder, dependency, isPending, newThreadPage } = props;

  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchedOptions, setSearchedOptions] = useState(options);
  const [disabled, setDisabled] = useState(options.length === 0);
  const multiSelectFilterRef = useRef(null);

  useEffect(() => {
    handleClickOutside(multiSelectFilterRef, () => setShowOptions(false));
  }, [showOptions]);

  useEffect(() => {
    setSearchedOptions(options);
  }, [options]);

  useEffect(() => {
    const filteredOptions = options.filter((option) => option.includes(searchValue));
    setSearchedOptions(filteredOptions);
  }, [searchValue]);

  useEffect(() => {
    setDisabled(!dependency);
  }, [dependency]);

  useEffect(() => {
    if (disabled) {
      setList([]);
      setSearchValue("");
      setShowOptions(false);
    }
  }, [disabled]);

  useEffect(() => {
    // Sort the options based on appearance in the list.
    setOptions(
      [...options].sort((a, b) =>
        list.includes(a) && !list.includes(b) ? -1 : !list.includes(a) && list.includes(b) ? 1 : 0
      )
    );
  }, [list]);

  /**
   * Handle the selection of an option.
   *
   * @function
   * @param {string} option - The selected option.
   * @returns {void}
   */
  const handleSelectOption = (option) => {
    if (!options.includes(option)) {
      setOptions([...options, option]);
    }
    if (!list.includes(option)) {
      setList([...list, option]);
    } else {
      setList(list.filter((listObj) => listObj !== option));
    }
    setSearchValue("");
  };

  return (
    <div className="multi-select-filter-div" ref={multiSelectFilterRef}>
      <div
        className={
          "multi-select-filter-value-bar" +
          (list.length === 0 ? " placeholder" : "") +
          (disabled ? " disabled" : "") +
          (isPending ? " pending" : "") +
          (newThreadPage ? " new-thread-page" : "")
        }
        onClick={() => {
          if (!disabled && !isPending) setShowOptions(!showOptions);
        }}
      >
        {isPending ? (
          <div className="lds-dual-ring" id="select-filter-loading"></div>
        ) : disabled ? (
          ""
        ) : (
          <>
            {list.length === 0 ? placeholder : list.join(", ")}
            <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
          </>
        )}
      </div>
      <div className={"multi-select-filter-select" + (showOptions ? " show" : "")}>
        <ul className={"multi-select-filter-options" + (newThreadPage ? " new-thread-page" : "")}>
          <input
            className="multi-select-input"
            placeholder="חיפוש / הוספה"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && !options.includes(searchValue) && (
            <li className="multi-select-filter-option add-option" onClick={() => handleSelectOption(searchValue)}>
              {searchValue}
              <span className="material-symbols-outlined add-icon">add</span>
            </li>
          )}
          {searchedOptions.map((option, index) => (
            <li className="multi-select-filter-option" key={index} onClick={() => handleSelectOption(option)}>
              <input
                className="multi-select-filter-checkbox"
                type="checkbox"
                checked={list.includes(option)}
                readOnly
              />
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MultiSelectFilter;
