import React from 'react';

export default function SearchBar() {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        data-testid="search-input"
        placeholder="Search..."
        type="text"
      />
    </div>
  );
}
