"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  HAPPY_HOURS,
  HappyHourTime,
  HappyHours,
  HappyHoursData,
  Restaurant,
} from "../../lib/hh_list";
import Link from "next/link";
import ImageLoadingWrapper from "../../utils/PreLoader/ImageLoadingWrapper";

export default function SearchPage() {
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
    <div className="Search p-8 bg-black flex flex-col gap-5 items-center">
      <h2 className="Title font-bold mt-10 mb-2 text-white">
        Find Your Denver Happy Hour
      </h2>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
      </Suspense> */}
      {sortHappyHours(HAPPY_HOURS).map((restaurant) => {
        return (
          <div
            className="DisplayBox w-full p-4 md:flex-row flex-col bg-gray-800 text-wrap text-white rounded-lg flex max-w-screen-md gap-5"
            key={restaurant.name}
          >
            <div className="LeftColumn md:w-1/2 overflow-hidden">
              <h2 className="RestaurantName">{restaurant.name}</h2>
              <Link
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-label="live project"
                href={restaurant.website ?? "www.joshuaduncan.info"}
                target="_blank"
                className="techItem__image-link"
              >
                <div className="RestaurantImage h-[250px] max-w-[500px] w-fit overflow-hidden rounded-xl">
                  <ImageLoadingWrapper
                    restaurant={restaurant}
                    className="Image h-full object-contain"
                  />
                </div>
              </Link>
              <p className="Area">{`Location: ${restaurant.area}`}</p>
              <p className="Address">{`Address: ${restaurant.address}`}</p>
              <h3 className="Notes mt-2">Notes:</h3>
              {restaurant.notes.map((note) => {
                return (
                  <p className="Note" key={note}>
                    {note}
                  </p>
                );
              })}
              <Link className="Website" href={`${restaurant.website}`}>
                <button className="Button bg-primary text-white py-1 px-2 rounded-md mt-2">
                  Visit Website
                </button>
              </Link>
            </div>
            <div className="HHTimes md:w-1/2">
              <h3 className="TimeTitle font-semibold">Happy Hours:</h3>
              {formatHappyHours(restaurant.happyHours)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
