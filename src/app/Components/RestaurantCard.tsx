"use client";

import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import ImageLoadingWrapper from "../../utils/PreLoader/ImageLoadingWrapper";
import SiteButton from "./SmallComponents/siteButton";
import generateGoogleMapsUrl from "@/utils/generateMapsURL";
import HappyHourDisplay from "./HappyHourDisplay";

interface RestaurantWithDistance extends Restaurant {
  distance?: number;
}

interface RestaurantCardProps {
  restaurant: RestaurantWithDistance;
  today: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export default function RestaurantCard({
  restaurant,
  today,
  isExpanded,
  onToggleExpanded,
}: RestaurantCardProps) {
  return (
    <div className="RestaurantCard bg-white rounded-lg shadow-themeShadow px-10 py-6 flex w-full max-w-[1000px] flex-col-reverse gap-5 text-wrap text-black xs:flex-row">
      <div className="LeftColumn flex h-full w-full flex-col gap-4 xs:w-fit">
        <div className="RestaurantImage relative flex aspect-video w-full items-center overflow-hidden rounded-md bg-stone-300 xs:aspect-square xs:w-[150px] sm:w-[200px] md:w-[275px]">
          <ImageLoadingWrapper
            restaurant={restaurant}
            className="Image h-full w-full object-contain"
          />
        </div>
        <div className="Buttons w-full">
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
              className="AddressLink w-fit group"
              href={generateGoogleMapsUrl(
                restaurant.name,
                restaurant.address,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="Address w-fit underline text-stone-700 group-hover:text-po1 transition-colors duration-200 flex items-center gap-1">
                📍 {restaurant.address}
              </p>
            </Link>
            {restaurant.distance && (
              <span className="Distance inline-flex items-center gap-1 px-2 py-1 bg-po1/10 text-po1 text-xs font-medium rounded-full">
                🚶 {restaurant.distance.toFixed(1)} miles
              </span>
            )}
          </div>
        </div>
        <HappyHourDisplay
          happyHours={restaurant.happyHours}
          today={today}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
        {restaurant.notes.length > 0 && (
          <div className="NotesSection mt-2 w-full rounded-lg bg-stone-200 p-2">
            <h4 className="Notes font-sans">Notes:</h4>
            {restaurant.notes.map((note) => {
              return (
                <p className="Note text-lg leading-6" key={note}>
                  {note}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}