import React, { useState, useEffect, useRef } from "react";
import "./SelectFilter.css";

const SelectFilter = (props) => {
  const { options, value, setValue, placeholder, dependency, isPending } = props;
  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchedOptions, setSearchedOptions] = useState(options);
  const [disabled, setDisabled] = useState(false);
  const selectFilterRef = useRef(null);
  const isAvailable = !disabled && !isPending;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectFilterRef.current && !selectFilterRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearchedOptions(options);
    if (!value) setSearchValue("");
  }, [options]);

  useEffect(() => {
    setDisabled(!dependency);
  }, [dependency]);

  useEffect(() => {
    if (disabled) {
      setSearchValue("");
      setValue(null);
      setShowOptions(false);
    }
  }, [disabled]);

  useEffect(() => {
    const filteredOptions = options.filter((option) => option.name.includes(searchValue));
    setSearchedOptions(filteredOptions);
    if (value) setValue(null);
  }, [searchValue]);

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
                setValue(option.value);
                setSearchValue(option.name);
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
