import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./searchBar.css";

function SearchBar({ setSearchResults }) {
  const [input, setInput] = useState("");

  // Parse budget from user input (looks for "rs 300000", "budget 300000", etc.)
  const parseBudget = (text) => {
    const budgetMatch = text.match(/(?:rs|budget|₹)\s*(\d+(?:,\d+)*)/i);
    if (budgetMatch) {
      return parseInt(budgetMatch[1].replace(/,/g, ""), 10);
    }
    return null;
  };

  // Check if input is a PC build request
  const isPCBuildRequest = (text) => {
    return /\b(pc|build|custom|gaming|workstation|cpu|gpu|ram)\b/i.test(text);
  };

  const fetchData = async () => {
    try {
      if (input.trim() === "") {
        setSearchResults([]);
        return;
      }

      // Check if it's a PC build request
      if (isPCBuildRequest(input)) {
        const budget = parseBudget(input);
        if (budget) {
          // Fetch PC build suggestions
          const response = await fetch(
            `http://localhost:5000/products/pc-build?budget=${budget}`
          );
          const data = await response.json();
          setSearchResults(data);
        } else {
          // If no budget mentioned, show all PC-related products
          const response = await fetch(
            `http://localhost:5000/products?search=pc`
          );
          const data = await response.json();
          setSearchResults(data);
        }
      } else {
        // Standard product search
        const response = await fetch(
          `http://localhost:5000/products?search=${input}`
        );
        const data = await response.json();
        setSearchResults(data);
      }
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="searchbar-container">
      <div className="input-wrapper">
        <input
          placeholder="Search your item or describe a PC build (e.g., 'custom pc with rs 300000')"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>
          <FaSearch id="search-icon" />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
