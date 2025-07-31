"use client";

import ViewToggle from "./ViewToggle";

interface SearchFiltersProps {
  filterOption: string;
  onFilterChange: (value: string) => void;
  view: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
}

export default function SearchFilters({
  filterOption,
  onFilterChange,
  view,
  onViewChange,
}: SearchFiltersProps) {
  return (
    <div className="TitleBar w-full max-w-[1200px] rounded-md bg-stone-800 p-4 text-center font-sans text-white sm:mb-2">
      <div className="HeroSloganContainer flex w-full flex-wrap justify-center gap-x-2 text-center font-sans font-extrabold">
        <h2 className="HeroSlogan text-white">{`It's Happy Hour`}</h2>
        <h2 className="HeroSlogan text-py1 uppercase italic">Somewhere!</h2>
      </div>
      <p className="Title mt-1 font-allerta text-xl">
        Find Your Happy Hour In Denver!
      </p>
      <div className="Filters my-2 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="FilterSelect flex items-center gap-2">
          <label className="HHFilterLabel text-white">Filter:</label>
          <select
            value={filterOption}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-10 w-56 rounded-md border border-stone-400 p-2 text-black"
          >
            <option value="all">Show All</option>
            <option value="today">Has Happy Hour Today</option>
            <option value="now">Has Happy Hour Now!</option>
          </select>
        </div>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
}
