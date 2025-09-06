import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./searchBar.css";

function SearchBar({ setSearchResults }) {
  const [input, setInput] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products?search=${input}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setSearchResults([]);
    }
  };

  const handleSearch = () => {
    if (input.trim() !== "") {
      fetchData();
    }
  };

  return (
    <div className="searchbar-container">
      <div className="input-wrapper">
        <input
          placeholder="Search your item"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSearch}>
          <FaSearch id="search-icon" />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
