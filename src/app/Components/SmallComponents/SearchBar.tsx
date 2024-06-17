"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HAPPY_HOURS, HappyHoursData } from "@/lib/hh_list";

const SearchBar = () => {
  const [days, setdays] = useState<string[]>([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const filterParams = ["category", "woodType", "minPrice", "maxPrice"];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateUrlParams = (searchParams: URLSearchParams) => {
    router.push(`${pathname}?${searchParams.toString()}`, {
      scroll: false,
    });
  };

  // handle filters and search queries
  const handleSearchFilters = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (e.target.type === "checkbox") {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        newSearchParams.set(target.name, "true");
      } else {
        newSearchParams.delete(target.name);
      }
    } else {
      if (e.target.value) {
        newSearchParams.set(e.target.name, e.target.value);
      } else {
        newSearchParams.delete(e.target.name);
      }
    }
    updateUrlParams(newSearchParams);
  };

  // useEffect(() => {
  //   const woodTypesSet: Set<string> = new Set();

  //   HAPPY_HOURS.CO.forEach((restaurant: HappyHoursData) => {
  //     restaurant.woodType?.forEach((type) => {
  //       woodTypesSet.add(type);
  //     });
  //   });

  //   const sortedWoodTypes = Array.from(woodTypesSet).sort();

  //   setWoodTypes(sortedWoodTypes);
  // }, []);

  return (
    <form
      id="filters"
      className="SearchBar via-primaryOrange w-full max-w-screen-md rounded-full bg-gradient-to-b from-red-500 to-orange-400 pr-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="InnerContainer">
        <div className="MainOptions">
          {/* SEARCH BAR */}
          <div className="SearchInput flex w-full items-center gap-2">
            <input
              className="Input h-10 w-full rounded-full border-none px-3 text-base capitalize text-black"
              type="text"
              id="search"
              name="query"
              placeholder="Search:"
              onChange={(e) => handleSearchFilters(e)}
              defaultValue={searchParams.get("query")?.toString()}
            />
            <button className="SearchButton" type="button">
              <Image
                className="SearchImage hover:scale-105"
                src="/ui-elements/search.png"
                width={24}
                height={24}
                alt="search"
              />
            </button>
          </div>
          {/* FILTER OPTIONS */}
          {/* <div className="FilterOptions flex flex-col my-2 sm:flex-row gap-2 items-center">
            <label className="Label block">Filter By:</label>
            <div className="Checkboxes flex gap-2 items-center h-7"> */}
          {/* HAPPY HOUR NOW! */}
          {/* <label className="_checkbox-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="happyHourNow"
                  className="_checkbox"
                  onChange={(e) => handleSearchFilters(e)}
                  checked={searchParams.get("inStock") === "true"}
                />
                HappyHour Now!
              </label>
            </div>
          </div> */}
        </div>

        {/* Additional FILTER */}
        {/* <div className="Filters flex flex-wrap gap-4 justify-between w-full"> */}
        {/* LOCATION FILTER */}
        {/* <div className="_field item1 flex gap-2 items-center">
            <label htmlFor="location" className="_label block">
              Location:
            </label>
            <select
              id="location"
              name="location"
              className="_select bg-white border-none rounded px-2 text-base text-black"
              onChange={(e) => handleSearchFilters(e)}
              defaultValue={searchParams.get("location")?.toString()}
            >
              <option value="">None</option>
              <option value="furniture">Furniture</option>
              <option value="housewares">Housewares</option>
              <option value="guitars">Guitars</option>
              <option value="accessories">Other</option>
            </select>
          </div> */}

        {/* DAY OF WEEK FILTER */}
        {/* <div className="Field item2 flex gap-2 items-center">
            <label htmlFor="day-of-week" className="Label block">
              Day of Week:
            </label>
            <select
              className="Select bg-white border-none rounded px-2 text-base text-black"
              id="day-of-week"
              name="dayOfWeek"
              onChange={(e) => handleSearchFilters(e)}
              defaultValue={searchParams.get("dayOfWeek")?.toString()}
            >
              <option value="">None</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div> */}

        {/* TIME OF DAY FILTER */}
        {/* <div className="_price-filters item3 flex gap-4">
            <div className="_field flex gap-2 items-center">
              <label htmlFor="time" className="_label block">
                Time:
              </label>
              <select
                id="time"
                name="time"
                className="_select bg-white border-none rounded px-2 text-base text-black"
                onChange={(e) => handleSearchFilters(e)}
                defaultValue={searchParams.get("time")?.toString()}
              >
                <option value="">No Min</option>
                <option value={50}>&gt; $50</option>
                <option value={100}>&gt; $100</option>
                <option value={250}>&gt; $250</option>
                <option value={500}>&gt; $500</option>
                <option value={1000}>&gt; $1000</option>
              </select>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </form>
  );
};

export default SearchBar;
