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
    <div className="RestaurantCard flex w-full max-w-[1000px border border-gray-200 flex-col gap-5 text-wrap rounded-lg bg-white p-4 sm:p-6 text-black shadow-themeShadow xs:flex-row">
      <div className="LeftColumn flex h-full w-full flex-col gap-2 xs:w-fit">
        <div className="RestaurantImage relative flex aspect-video w-full items-center overflow-hidden rounded-sm border border-gray-200 xs:aspect-square xs:w-[200px]">
          <ImageLoadingWrapper
            restaurant={restaurant}
            className="Image h-full w-full object-contain"
          />
        </div>
        <Link className="Website w-full" href={`${restaurant.website}`}>
          <SiteButton
            variant="orange"
            rounded={false}
            text="Visit Website"
            size="lg"
          />
        </Link>
      </div>
      <div className="RightColumn flex w-full flex-col gap-2 overflow-hidden">
        <div className="Name&Address">
          <h2 className="RestaurantName font-sans">{restaurant.name}</h2>
          <div className="LocationContainer flex flex-wrap gap-x-2">
            {restaurant.area && (
              <p className="Area text-gray-600">{`${restaurant.area} -`}</p>
            )}
            <Link
              className="AddressLink group w-fit"
              href={generateGoogleMapsUrl(restaurant.name, restaurant.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="Address flex w-fit items-center gap-1 text-stone-700 underline transition-colors duration-200 group-hover:text-po1">
                📍 {restaurant.address}
              </p>
            </Link>
            {restaurant.distance && (
              <span className="Distance inline-flex items-center gap-1 rounded-full bg-po1/10 px-2 py-1 text-xs font-medium text-po1">
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
          <div className="NotesSection mt-2 w-full flex gap-2 rounded-lg bg-stone-200 px-4 py-2">
            <p className="NoteTitle font-sans">Notes:</p>
            <div className="Notes flex flex-col gap-1">
              {restaurant.notes.map((note) => {
                return (
                  <p className="Note text-lg font-sans" key={note}>
                    {note}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
