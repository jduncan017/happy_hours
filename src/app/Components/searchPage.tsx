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
import SiteButton from "./SmallComponents/siteButton";

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
    <div className="Search p-8 bg-neutral flex flex-col gap-5 items-center">
      <h2 className="Title font-bold mt-10 mb-2 text-black font-sans">
        Find Your Denver Happy Hour
      </h2>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
      </Suspense> */}
      {sortHappyHours(HAPPY_HOURS).map((restaurant, index) => {
        return (
          <div
            className="DisplayBox w-full p-4 md:flex-row flex-col border-b-gray-800 border-solid border-b text-wrap max-w-[1000px] text-black flex gap-5"
            key={index}
          >
            <div className="LeftColumn flex flex-col gap-4 w-fit h-full">
              <div className="RestaurantImage relative bg-stone-300 w-52 h-52 md:h-[300px] md:w-[300px] overflow-hidden rounded-xl">
                <ImageLoadingWrapper
                  restaurant={restaurant}
                  className="Image object-contain h-full w-full"
                />
              </div>
              <Link className="Website" href={`${restaurant.website}`}>
                <SiteButton
                  colorFill={true}
                  rounded={false}
                  text="Visit Website"
                  size="lg"
                />
              </Link>
            </div>
            <div className="RightColumn overflow-hidden">
              <h2 className="RestaurantName font-sans">{restaurant.name}</h2>
              <p className="Area">{restaurant.area}</p>
              <p className="Address">{restaurant.address}</p>
              <div className="HHTimes w-full">
                <h3 className="TimeTitle font-semibold font-sans">
                  Happy Hours:
                </h3>
                {formatHappyHours(restaurant.happyHours)}
              </div>
              {restaurant.notes.length > 0 && (
                <h3 className="Notes mt-2 font-sans">Notes:</h3>
              )}
              {restaurant.notes.map((note) => {
                return (
                  <p className="Note" key={note}>
                    {note}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
