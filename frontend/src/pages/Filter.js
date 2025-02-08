import React from "react";

const Filter = ({ label, options, selectedOption, onChange }) => {
  return (
    <div className="text-center mb-4">
      <label htmlFor="filter" className="mr-2 font-semibold">
        {label}:
      </label>
      <select
        id="filter"
        className="p-2 bg-gray-800 text-white rounded-lg"
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
