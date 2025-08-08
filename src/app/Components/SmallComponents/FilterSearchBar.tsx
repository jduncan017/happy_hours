import { useState, useEffect } from "react";

interface FilterSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  value?: string;
}

export default function FilterSearchBar({
  placeholder = "Search restaurants...",
  onSearch,
  className = "",
  value = "",
}: FilterSearchBarProps) {
  const [query, setQuery] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Update query when value prop changes (for clearing)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on form submit
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`FilterSearchBar relative ${className}`}
      role="search"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-8 pl-10 pr-4 bg-white border border-gray-300 rounded-full text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          aria-label="Search restaurants by name, cuisine, or area"
          aria-describedby="search-icon"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3" id="search-icon" aria-hidden="true">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </form>
  );
}
