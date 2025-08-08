import React, { useMemo } from "react";
import type { HappyHours, HappyHourTime } from "@/lib/types";
import { formatTimeRange } from "@/utils/time/timeUtils";

interface HappyHourDisplayProps {
  happyHours: HappyHours;
  today: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const HappyHourDisplay = React.memo<HappyHourDisplayProps>(({
  happyHours,
  today,
  isExpanded,
  onToggleExpanded,
}) => {
  const formatHappyHours = useMemo(
    () => (times: HappyHours, isExpanded: boolean) => {
      const daysToShow = isExpanded ? Object.keys(times) : [today];

      return daysToShow.map((day) => {
        const timesForDay = times[day];
        if (timesForDay) {
          const timesFormatted = timesForDay.map((time: HappyHourTime) => 
            formatTimeRange(time.Start, time.End)
          );

          return (
            <li
              key={day}
              className="HappyHourTime tracking-wide text-gray-700 flex gap-1"
              aria-label={`${day} happy hour: ${timesFormatted.join(', ')}`}
            >
              {isExpanded && <p className="HappyHourDay w-12">{`${day}:`}</p>}
              <div className="HappyHourTimes flex flex-col">
                {timesFormatted.map((timeFormatted, index) => (
                  <p key={index}>{timeFormatted}</p>
                ))}
              </div>
            </li>
          );
        }
        return null;
      });
    },
    [today],
  );

  return (
    <div className="HHTimes w-full flex-grow" role="region" aria-label="Happy hour times">
      <h3 className="TimeTitle font-sans font-semibold" id={`happy-hours-title`}>
        {isExpanded ? "All Happy Hours:" : `${today} Happy Hour:`}
      </h3>
      <div aria-labelledby="happy-hours-title">
        {happyHours[today] || isExpanded ? (
          formatHappyHours(happyHours, isExpanded)
        ) : (
          <p className="text-gray-700" aria-live="polite">{`No Happy Hour Today :(`}</p>
        )}
      </div>
      <button
        onClick={onToggleExpanded}
        className="ShowMoreButton mt-1 cursor-pointer italic text-po1 hover:text-black bg-transparent border-none p-0 text-left"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Hide all happy hour times" : "Show all happy hour times"}
      >
        {isExpanded ? "Hide All" : "Show All"}
      </button>
    </div>
  );
});

HappyHourDisplay.displayName = "HappyHourDisplay";

export default HappyHourDisplay;
