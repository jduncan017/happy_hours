import { useState, useEffect } from "react";
import TextInput from "./TextInput";
import { Search } from "lucide-react";

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
      <TextInput
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        icon={<Search className="w-4 h-4" />}
        variant="search"
        size="sm"
        className="h-8 text-sm border border-gray-300 rounded-full"
        aria-label="Search restaurants by name, cuisine, or area"
      />
    </form>
  );
}
