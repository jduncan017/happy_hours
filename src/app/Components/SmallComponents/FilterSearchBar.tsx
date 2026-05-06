import { useState, useEffect, useRef } from "react";
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

  // Keep latest onSearch in a ref so the debounce effect doesn't fire
  // every time the parent re-renders with a new function identity.
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Sync from parent-controlled value (e.g. clear-all)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounce typing → fire onSearch once user pauses
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchRef.current(query);
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
