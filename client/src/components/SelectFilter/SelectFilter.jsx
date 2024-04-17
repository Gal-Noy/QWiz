import React, { useState, useEffect, useRef } from "react";
import { handleClickOutside } from "../../utils/generalUtils";
import "./SelectFilter.css";

/**
 * A select filter component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.options - The available options for the filter.
 * @param {Object} props.value - The selected option for the filter.
 * @param {Function} props.setValue - The function to update the selected option.
 * @param {string} props.placeholder - The placeholder for the filter.
 * @param {boolean} props.dependency - The dependency for the filter.
 * @param {boolean} props.isPending - Indicates if the filter is in a pending state.
 * @returns {JSX.Element} The rendered SelectFilter component.
 */
const SelectFilter = (props) => {
  const { options, value, setValue, placeholder, dependency, isPending } = props;

  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchedOptions, setSearchedOptions] = useState(options);
  const [disabled, setDisabled] = useState(false);
  const selectFilterRef = useRef(null);
  const isAvailable = !disabled && !isPending;

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    handleClickOutside(selectFilterRef, () => setShowOptions(false));
  }, [showOptions]);

  // Update the searched options when the options change
  useEffect(() => {
    setSearchedOptions(options);
    if (!value) setSearchValue("");
  }, [options]);

  // Filter the options based on the search input, and reset the value if during search
  useEffect(() => {
    const filteredOptions = options.filter((option) => option.name.includes(searchValue));
    setSearchedOptions(filteredOptions);
    if (value) setValue(null);
  }, [searchValue]);

  // Disable the filter when the dependency is false
  useEffect(() => {
    setDisabled(!dependency);
  }, [dependency]);

  // Reset the filter when it's disabled, and close the dropdown
  useEffect(() => {
    if (disabled) {
      setSearchValue("");
      setValue(null);
      setShowOptions(false);
    }
  }, [disabled]);

  return (
    <div className="select-filter-div" ref={selectFilterRef}>
      <div className="select-filter-search-value">
        <input
          onFocus={() => {
            if (isAvailable) setShowOptions(!showOptions);
          }}
          placeholder={isAvailable ? placeholder : ""}
          className="upload-form-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={!isAvailable}
        />
        {isPending && <div className="lds-dual-ring" id="select-filter-loading"></div>}
      </div>
      <div className={"select-filter-select" + (showOptions ? " show" : "")}>
        <ul className="select-filter-options">
          {searchedOptions.map((option, index) => (
            <li
              className="select-filter-option"
              key={index}
              onClick={() => {
                setSearchValue(option.name);
                setValue(option);
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
