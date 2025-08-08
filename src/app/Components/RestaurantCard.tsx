import React from "react";
import type { Restaurant } from "@/lib/types";
import ImageLoadingWrapper from "@/utils/image/PreLoader/ImageLoadingWrapper";
import SiteButton from "./SmallComponents/siteButton";
import generateGoogleMapsUrl from "@/utils/geo/generateMapsURL";
import HappyHourDisplay from "./HappyHourDisplay";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import ImageErrorFallback from "./ErrorBoundary/ImageErrorFallback";
import MaxWidthContainer from "./Layout/MaxWidthContainer";
import FlexContainer from "./Layout/FlexContainer";

interface RestaurantWithDistance extends Restaurant {
  distance?: number;
}

interface RestaurantCardProps {
  restaurant: RestaurantWithDistance;
  today: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const RestaurantCard = React.memo<RestaurantCardProps>(
  ({ restaurant, today, isExpanded, onToggleExpanded }) => {
    return (
      <MaxWidthContainer 
        className="RestaurantCard flex border-b border-stone-300 flex-col gap-5 text-wrap bg-white p-4 sm:p-6 text-black xs:flex-row"
        role="article"
        aria-label={`${restaurant.name} restaurant details`}
      >
        <FlexContainer
          direction="col"
          gap="2"
          className="LeftColumn h-full w-full xs:w-fit"
        >
          <div className="RestaurantImage relative flex aspect-video w-full items-center overflow-hidden rounded-sm border border-n3 xs:aspect-square xs:w-[200px]">
            <ErrorBoundary fallback={ImageErrorFallback}>
              <ImageLoadingWrapper
                restaurant={restaurant}
                className="Image h-full w-full object-contain"
                aria-label={`Photo of ${restaurant.name}`}
              />
            </ErrorBoundary>
          </div>
        </FlexContainer>
        <div className="RightColumn flex w-full flex-col gap-2 overflow-hidden">
          <div className="Name&Address">
            <h2
              className="RestaurantName font-sans truncate text-xl font-semibold"
              title={restaurant.name}
            >
              <span className="Name align-baseline">{restaurant.name}</span>
              {restaurant.area && (
                <span className="Area ml-2 align-baseline text-sm text-gray-600">
                  {restaurant.area}
                </span>
              )}
            </h2>
            <p
              className="AddressText flex w-fit items-center gap-1 italic text-stone-600"
              title={restaurant.address}
              aria-label={`Address: ${restaurant.address}`}
            >
              {restaurant.address}
            </p>
          </div>
          <div className="HHAndNotes flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="HappyHourWrapper flex-1 min-w-0">
              <div className="ActionButtons mb-2 flex flex-wrap items-center gap-2" role="group" aria-label="Restaurant actions">
                <a
                  className="GetDirectionsButton"
                  href={generateGoogleMapsUrl(
                    restaurant.name,
                    restaurant.address,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${restaurant.name}`}
                >
                  <SiteButton
                    text="Get Directions"
                    rounded={false}
                    variant="orange"
                    size="xs"
                  />
                </a>
                {restaurant.website && (
                  <a
                    className="VisitWebsiteButton"
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Visit ${restaurant.name} website`}
                  >
                    <SiteButton
                      text="Visit Website"
                      rounded={false}
                      variant="white"
                      size="xs"
                    />
                  </a>
                )}
                {restaurant.distance && (
                  <span 
                    className="Distance inline-flex items-center gap-1 rounded-full bg-po1/10 px-2 py-1 text-xs font-medium text-po1"
                    aria-label={`Distance: ${restaurant.distance.toFixed(1)} miles away`}
                  >
                    🚶 {restaurant.distance.toFixed(1)} miles
                  </span>
                )}
              </div>
              <HappyHourDisplay
                happyHours={restaurant.happyHours}
                today={today}
                isExpanded={isExpanded}
                onToggleExpanded={onToggleExpanded}
              />
            </div>
            {restaurant.notes.length > 0 && (
              <div className="NotesSection flex flex-col flex-wrap items-start gap-2" role="complementary" aria-label="Additional restaurant information">
                <p className="NoteTitle font-sans text-sm text-stone-700" id={`notes-${restaurant.name.replace(/\s+/g, '-').toLowerCase()}`}>
                  Notes:
                </p>
                <div className="Notes flex flex-col flex-wrap gap-2" aria-labelledby={`notes-${restaurant.name.replace(/\s+/g, '-').toLowerCase()}`}>
                  {restaurant.notes.map((note, idx) => {
                    const isUrl = /^https?:\/\//i.test(note);
                    if (isUrl) {
                      try {
                        const url = new URL(note);
                        const slug =
                          url.pathname.split("/").filter(Boolean).pop() ||
                          url.hostname;
                        const label = slug.replace(/[-_]+/g, " ");
                        return (
                          <a
                            className="NoteChip inline-flex capitalize items-center rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-800 underline hover:bg-stone-300"
                            key={`${note}-${idx}`}
                            href={note}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={note}
                            aria-label={`Visit link: ${label}`}
                          >
                            {label}
                          </a>
                        );
                      } catch {
                        // fallthrough to plain chip
                      }
                    }
                    return (
                      <span
                        className="NoteChip inline-flex items-center rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-800"
                        key={`${note}-${idx}`}
                      >
                        {note}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </MaxWidthContainer>
    );
  },
);

RestaurantCard.displayName = "RestaurantCard";

export default RestaurantCard;
