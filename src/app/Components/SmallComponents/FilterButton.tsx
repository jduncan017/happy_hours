interface FilterButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function FilterButton({
  children,
  active = false,
  onClick,
  disabled = false,
}: FilterButtonProps) {
  const baseClasses = "h-8 px-3 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
  
  const stateClasses = active
    ? "bg-py1 text-white border border-py1"
    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses}`}
    >
      {children}
    </button>
  );
}