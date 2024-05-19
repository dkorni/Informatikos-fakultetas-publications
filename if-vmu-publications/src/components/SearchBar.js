import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for publications..."
      />
      <button className="btn btn-primary" onClick={handleSearchClick}>Search</button>
    </div>
  );
};

export default SearchBar;
