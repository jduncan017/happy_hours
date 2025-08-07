import React, { useMemo } from "react";
import type { HappyHours, HappyHourTime } from "@/lib/types";

interface HappyHourDisplayProps {
  happyHours: HappyHours;
  today: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

function HappyHourDisplay({
  happyHours,
  today,
  isExpanded,
  onToggleExpanded,
}: HappyHourDisplayProps) {
  const formatHappyHours = useMemo(
    () => (times: HappyHours, isExpanded: boolean) => {
      const daysToShow = isExpanded ? Object.keys(times) : [today];

      return daysToShow.map((day) => {
        const timesForDay = times[day];
        if (timesForDay) {
          const timesFormatted = timesForDay.map((time: HappyHourTime) => {
            let startHour = parseInt(time.Start.split(":")[0], 10);
            let startMinutes = time.Start.split(":")[1];
            let startMeridiem = startHour >= 12 ? "PM" : "AM";
            startHour = startHour > 12 ? startHour - 12 : startHour;
            startHour = startHour === 0 ? 12 : startHour;
            let startTimeFormatted = `${startHour}:${startMinutes} ${startMeridiem}`;

            let endHour = parseInt(time.End.split(":")[0], 10);
            let endMinutes = time.End.split(":")[1];
            let endMeridiem = endHour >= 12 ? "PM" : "AM";
            endHour = endHour > 12 ? endHour - 12 : endHour;
            endHour = endHour === 0 ? 12 : endHour;
            let endTimeFormatted = `${endHour}:${endMinutes} ${endMeridiem}`;

            return `${startTimeFormatted} - ${endTimeFormatted}`;
          });

          return (
            <li
              key={day}
              className="HappyHourTime tracking-wide text-gray-700 flex gap-1"
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
    <div className="HHTimes w-full flex-grow">
      <h3 className="TimeTitle font-sans font-semibold">
        {isExpanded ? "All Happy Hours:" : `${today} Happy Hour:`}
      </h3>
      {happyHours[today] || isExpanded ? (
        formatHappyHours(happyHours, isExpanded)
      ) : (
        <p className="text-gray-700">{`No Happy Hour Today :(`}</p>
      )}
      <p
        onClick={onToggleExpanded}
        className="ShowMoreButton mt-1 cursor-pointer italic text-po1/80 hover:text-black"
      >
        {isExpanded ? "Hide All" : "Show All"}
      </p>
    </div>
  );
}

export default React.memo(HappyHourDisplay);
