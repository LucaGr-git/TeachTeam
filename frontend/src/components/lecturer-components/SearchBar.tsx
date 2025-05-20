import React, { ChangeEvent } from "react";
import { useState } from "react";

interface SearchBarProps {
    // Props for the search bar
    onSearch: (query: string) => void;
}

const SearchBar = 
(
    {onSearch}: SearchBarProps
) => 
{
    // useState hook for setting the query the search will be searching
    const [query, setQuery] = useState('');

    // handling the user input change to update setQuery and onSearch 
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    }
  
    return (
      <input
        type="text"
        placeholder="Search by course, tutor, skill, etc."
        value={query}
        onChange={handleInputChange}
        className="p-2 border rounded w-full"
      />
    );
}

export default SearchBar;