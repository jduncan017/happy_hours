import { useState } from "react";

interface FilterDropdownProps {
  label: string;
  value: string | string[];
  options: { value: string; label: string }[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  multiple = false,
  placeholder = "Any",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = multiple 
    ? (value as string[]).length > 0 
      ? `${label} (${(value as string[]).length})`
      : label
    : (value as string) && (value as string) !== "" 
      ? options.find(opt => opt.value === value)?.label || label
      : label;

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = value as string[];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : "");
  };

  return (
    <div className="FilterDropdown relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 pr-8 bg-white border border-gray-300 rounded-full text-sm hover:border-gray-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 cursor-pointer min-w-[120px] flex items-center justify-between text-left"
      >
        <span className="text-gray-700 truncate">
          {displayValue}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {!multiple && (
            <button
              onClick={() => handleOptionClick("")}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {placeholder}
            </button>
          )}
          
          {options.map((option) => {
            const isSelected = multiple 
              ? (value as string[]).includes(option.value)
              : value === option.value;
              
            return (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between ${
                  isSelected ? 'bg-stone-50' : ''
                }`}
              >
                <span>{option.label}</span>
                {multiple && isSelected && (
                  <svg className="w-4 h-4 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </button>
            );
          })}
          
          {multiple && (value as string[]).length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={handleClearAll}
                className="w-full px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded focus:outline-none"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}