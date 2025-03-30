import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ subject, department });
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Search by department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleFilterChange}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
