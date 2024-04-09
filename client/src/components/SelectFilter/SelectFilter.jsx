import React, { useState, useEffect, useRef } from "react";
import "./SelectFilter.css";

const SelectFilter = (props) => {
  const { options, onChange, placeholder, dependency } = props;
  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchedOptions, setSearchedOptions] = useState(options);
  const [disabled, setDisabled] = useState(false);
  const selectFilterRef = useRef(null);

  useEffect(() => {
    if (searchValue) {
      const filteredOptions = options.filter((option) => option.name.includes(searchValue));
      setSearchedOptions(filteredOptions);
    } else {
      onChange(null);
    }
  }, [searchValue]);

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
    setSearchValue;
    setDisabled(!!!dependency);
  }, [dependency]);

  return (
    <div className="select-filter-div" ref={selectFilterRef}>
      <div className="select-filter-search-value" onClick={() => setShowOptions(!showOptions)}>
        <input
          placeholder={!disabled ? placeholder : ""}
          className="select-search-input"
          value={!disabled ? searchValue : ""}
          onChange={(e) => {
            setSearchValue(e.target.value);
            const filteredOptions = options.filter((option) => option.name.includes(e.target.value));
            setSearchedOptions(filteredOptions);
            setShowOptions(true);
          }}
          disabled={disabled}
        />
      </div>
      <div className={"select-filter-select" + (showOptions ? " show" : "")}>
        <ul className="select-filter-options">
          {searchValue &&
            searchedOptions.map((option, index) => (
              <li
                className="select-filter-option"
                key={index}
                onClick={() => {
                  onChange(option.value);
                  setSearchValue(option.name);
                  setShowOptions(false);
                }}
              >
                {option.name}
              </li>
            ))}
          {!searchValue &&
            options.map((option, index) => (
              <li
                className="select-filter-option"
                key={index}
                onClick={() => {
                  onChange(option.value);
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
