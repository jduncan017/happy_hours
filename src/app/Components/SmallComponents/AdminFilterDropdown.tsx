import { useState } from "react";

interface AdminFilterDropdownProps {
  label: string;
  value: string | string[];
  options: { value: string; label: string }[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
}

export default function AdminFilterDropdown({
  label,
  value,
  options,
  onChange,
  multiple = false,
  placeholder = "Any",
}: AdminFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = multiple
    ? (value as string[]).length > 0
      ? `${label} (${(value as string[]).length})`
      : label
    : (value as string) && (value as string) !== ""
      ? options.find((opt) => opt.value === value)?.label || label
      : label;

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = value as string[];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
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
    <div className="AdminFilterDropdown relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="AdminFilterButton w-full px-3 py-2 bg-stone-800/50 border border-white/10 rounded-xl text-sm text-white/80 hover:bg-stone-800/70 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1 transition-all cursor-pointer flex items-center justify-between"
      >
        <span className="truncate font-medium">{displayValue}</span>
        <svg
          className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="AdminFilterOptions absolute top-full left-0 mt-1 w-full bg-stone-800 border border-white/10 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {!multiple && (
            <button
              onClick={() => handleOptionClick("")}
              className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-stone-700 focus:bg-stone-700 focus:outline-none"
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
                className={`w-full px-3 py-2 text-left text-sm border-b border-white/5 hover:bg-stone-700 focus:bg-stone-700 focus:outline-none flex items-center justify-between ${
                  isSelected ? "bg-po1/20 text-po1" : "text-white/80"
                }`}
              >
                <span>{option.label}</span>
                {multiple && isSelected && (
                  <svg
                    className="w-4 h-4 text-po1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            );
          })}

          {multiple && (value as string[]).length > 0 && (
            <div className="border-t border-white/10 p-2">
              <button
                onClick={handleClearAll}
                className="w-full px-2 py-1 text-xs text-white/60 hover:text-white hover:bg-stone-700 rounded focus:outline-none"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
