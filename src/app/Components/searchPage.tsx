"use client";
import React, { useEffect, useState, useMemo } from "react";
import { HAPPY_HOURS, HappyHourTime, HappyHours } from "../../lib/hh_list";
import type { Restaurant, HappyHoursData } from "../../lib/hh_list";
import Link from "next/link";
import ImageLoadingWrapper from "../../utils/PreLoader/ImageLoadingWrapper";
import SiteButton from "./SmallComponents/siteButton";
import generateGoogleMapsUrl from "@/utils/generateMapsURL";
import {
  sortHappyHours,
  filterHappyHoursToday,
  filterHappyHoursNow,
} from "@/utils/happyHourUtils";

export default function SearchPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [today, setToday] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [displayedRestaurants, setDisplayedRestaurants] = useState<
    Restaurant[]
  >([]);

  useEffect(() => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = daysOfWeek[new Date().getDay()];
    setToday(today);
  }, []);

  useEffect(() => {
    let filteredRestaurants = sortHappyHours(HAPPY_HOURS);

    if (filterOption === "today") {
      filteredRestaurants = filterHappyHoursToday(filteredRestaurants, today);
    } else if (filterOption === "now") {
      filteredRestaurants = filterHappyHoursNow(filteredRestaurants, today);
    }

    setDisplayedRestaurants(filteredRestaurants);
  }, [filterOption, today]);

  const formatHappyHours = useMemo(
    () => (times: HappyHours, isExpanded: boolean) => {
      const daysToShow = isExpanded ? Object.keys(times) : [today];

      return daysToShow.map((day) => {
        const timesForDay = times[day];
        if (timesForDay) {
          const timesFormatted = timesForDay
            .map((time: HappyHourTime) => {
              let startHour = parseInt(time.Start.split(":")[0], 10);
              let startMinutes = time.Start.split(":")[1];
              let startMeridiem = startHour >= 12 ? "PM" : "AM";
              startHour = startHour > 12 ? startHour - 12 : startHour;
              startHour = startHour === 0 ? 12 : startHour; // Convert 0 hour to 12 for 12AM
              let startTimeFormatted = `${startHour}:${startMinutes} ${startMeridiem}`;

              let endHour = parseInt(time.End.split(":")[0], 10);
              let endMinutes = time.End.split(":")[1];
              let endMeridiem = endHour >= 12 ? "PM" : "AM";
              endHour = endHour > 12 ? endHour - 12 : endHour;
              endHour = endHour === 0 ? 12 : endHour; // Convert 0 hour to 12 for 12AM
              let endTimeFormatted = `${endHour}:${endMinutes} ${endMeridiem}`;

              return `${startTimeFormatted} - ${endTimeFormatted}`;
            })
            .join(" // ");

          return <p key={day}>{`${day}: ${timesFormatted}`}</p>;
        }
        return null;
      });
    },
    [today],
  );

  const toggleExpanded = (restaurantName: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantName)) {
        newSet.delete(restaurantName);
      } else {
        newSet.add(restaurantName);
      }
      return newSet;
    });
  };

  return (
    <div className="Search mx-auto mt-8 flex max-w-[1000px] flex-col items-center gap-2 rounded-md border border-solid border-stone-700 bg-neutralLight p-4 shadow-themeShadow sm:p-8">
      <div className="TitleBar mb-2 w-full max-w-[1000px] rounded-lg bg-stone-800 p-4 text-center font-sans text-white">
        <h2 className="Title font-bold">Find Your Happy Hour In Denver!</h2>
        <div className="Filters my-2 w-full">
          <label className="HHFilterLabel mr-2">Filter:</label>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="h-10 w-56 rounded-md border border-stone-400 p-2 text-black"
          >
            <option value="all">Show All</option>
            <option value="today">Has Happy Hour Today</option>
            <option value="now">Has Happy Hour Now!</option>
          </select>
        </div>
      </div>

      <div className="RestaurantList scrollbar-hide w-full lg:max-h-[150vh] lg:overflow-y-scroll">
        {/* If No Restaurants */}
        {displayedRestaurants.length === 0 && (
          <p className="NoRestaurants my-6 text-center text-gray-700">
            Sadly, There are no happy hours that match these filters. 😔
          </p>
        )}

        {/* Restaurant List */}
        {displayedRestaurants.map((restaurant: Restaurant, index: number) => {
          const isExpanded = expanded.has(restaurant.name);

          return (
            <div
              className="RestaurantDisplay flex w-full max-w-[1000px] flex-col-reverse gap-5 text-wrap border-b border-solid border-b-stone-700 p-4 text-black xs:flex-row"
              key={index}
            >
              <div className="LeftColumn flex h-full w-full flex-col gap-4 xs:w-fit">
                <div className="RestaurantImage relative aspect-square w-full overflow-hidden rounded-xl bg-stone-300 xs:w-[150px] sm:w-[200px] md:w-[300px]">
                  <ImageLoadingWrapper
                    restaurant={restaurant}
                    className="Image h-full w-full object-contain"
                  />
                </div>
                <div className="Buttons flex w-full flex-col gap-2 md:flex-row">
                  <Link
                    className="Website w-full"
                    href={`${restaurant.website}`}
                  >
                    <SiteButton
                      colorFill={true}
                      rounded={false}
                      text="Visit Website"
                      size="lg"
                    />
                  </Link>
                  <Link
                    className="Directions w-full"
                    href={generateGoogleMapsUrl(
                      restaurant.name,
                      restaurant.address,
                    )}
                  >
                    <SiteButton
                      colorFill={false}
                      rounded={false}
                      text="Get Directions"
                      size="lg"
                    />
                  </Link>
                </div>
              </div>
              <div className="RightColumn flex w-full flex-col gap-2 overflow-hidden">
                <div className="Name&Address">
                  <h2 className="RestaurantName font-sans">
                    {restaurant.name}
                  </h2>
                  <div className="LocationContainer flex flex-wrap gap-x-2">
                    {restaurant.area && (
                      <p className="Area text-gray-600">{`${restaurant.area} -`}</p>
                    )}
                    <Link
                      className="AddressLink w-fit"
                      href={generateGoogleMapsUrl(
                        restaurant.name,
                        restaurant.address,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="Address w-fit underline">
                        {restaurant.address}
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="HHTimes w-full flex-grow">
                  <h3 className="TimeTitle font-sans font-semibold">
                    Happy Hour Today:
                  </h3>
                  {restaurant.happyHours[today] || isExpanded ? (
                    formatHappyHours(restaurant.happyHours, isExpanded)
                  ) : (
                    <p className="text-gray-700">{`No Happy Hour Today :(`}</p>
                  )}
                  {!isExpanded && (
                    <button
                      onClick={() => toggleExpanded(restaurant.name)}
                      className="ShowMoreButton text-lg text-gray-700 hover:text-black"
                    >
                      Show Other Days
                    </button>
                  )}
                </div>
                {restaurant.notes.length > 0 && (
                  <div className="NotesSection w-full rounded-lg bg-stone-200 p-2">
                    <h4 className="Notes font-sans">Notes:</h4>
                    {restaurant.notes.map((note) => {
                      return (
                        <p className="Note" key={note}>
                          {note}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
