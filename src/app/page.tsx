"use client";
import React, { useEffect, useState } from "react";
import {
  HAPPY_HOURS,
  HappyHourTime,
  HappyHours,
  HappyHoursData,
  Restaurant,
} from "../lib/hh_list";
import Link from "next/link";
import SearchBar from "./Components/SearchBar";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState({});
  // const searchParams = useSearchParams();
  function sortHappyHours(happyHourDataList: HappyHoursData) {
    return happyHourDataList.CO.Denver.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  function formatHappyHours(times: HappyHours) {
    // Generate a list of JSX elements representing happy hours for each day
    return Object.entries(times).map(([day, times]) => {
      if (times) {
        let timesFormatted = times
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
          .join(" | ");

        return <p key={day}>{`${day}: ${timesFormatted}`}</p>;
      }
    });
  }

  function filterDays(HAPPY_HOURS: HappyHoursData, dayQueryParam: string) {
    let filteredRestaurants: Restaurant[] = [];

    // Iterate over each city in CO
    Object.keys(HAPPY_HOURS.CO).forEach((cityName) => {
      const cityRestaurants = HAPPY_HOURS.CO[cityName];

      // Iterate over each restaurant in the city
      cityRestaurants.forEach((restaurant) => {
        const happyHours = restaurant.happyHours;

        // Check if the specified day's happy hours exist
        if (happyHours[dayQueryParam]) {
          // If the day exists, add the restaurant to the filtered list
          filteredRestaurants.push(restaurant);
        }
      });
    });

    return filteredRestaurants;
  }

  // update current search queries
  // useEffect(() => {
  //   let newSearchQuery: { [key: string]: string } = {};
  //   const entriesArray = Array.from(searchParams.entries());
  //   for (const [key, value] of entriesArray) {
  //     newSearchQuery[key] = value;
  //   }
  //   console.log(entriesArray);
  //   setSearchQuery(newSearchQuery);
  // }, [searchParams]);

  return (
    <div className="_home p-8 bg-slate-700 flex flex-col gap-5 items-center">
      <h1 className="_title font-bold mb-2 text-4xl">Denver Happy Hours</h1>
      <SearchBar />
      {sortHappyHours(HAPPY_HOURS).map((restaurant) => {
        return (
          <div
            className="_restaurant w-full p-4 bg-black rounded-lg flex max-w-screen-md gap-5"
            key={restaurant.name}
          >
            <div className="_left-column w-1/2">
              <h2 className="_restaurant__name font-semibold">
                {restaurant.name}
              </h2>
              <p className="_restaurant__area">{`Location: ${restaurant.area}`}</p>
              <p className="_restaurant__address">{`Address: ${restaurant.address}`}</p>
              <h3 className="_notes font-semibold mt-2">Notes:</h3>
              {restaurant.notes.map((note) => {
                return (
                  <p className="_note" key={note}>
                    {note}
                  </p>
                );
              })}
              <Link
                className="_restaurant__website"
                href={`${restaurant.website}`}
              >
                <button className="_site__button bg-teal-800 text-white py-1 px-2 rounded-md mt-2">
                  Visit Website
                </button>
              </Link>
            </div>
            <div className="_hh__times">
              <h3 className="_hh__times-title font-semibold">
                Happy Hour Times:
              </h3>
              {formatHappyHours(restaurant.happyHours)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
