import { Restaurant, HappyHoursData } from "@/lib/hh_list";

// sorts happy hours by name
export function sortHappyHours(happyHourDataList: HappyHoursData) {
  return happyHourDataList.CO.Denver.sort((a: Restaurant, b: Restaurant) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });
}

// filters for happy hours on the current day of the week
export function filterHappyHoursToday(
  restaurants: Restaurant[],
  today: string,
) {
  return restaurants.filter(
    (restaurant: Restaurant) => restaurant.happyHours[today],
  );
}

// filters for happy hours happening now
export const filterHappyHoursNow = (
  restaurants: Restaurant[],
  today: string,
) => {
  const currentTime = new Date().toTimeString().slice(0, 5);

  return restaurants.filter((restaurant: Restaurant) => {
    const timesForDay = restaurant.happyHours[today];
    if (!timesForDay) return false;
    return timesForDay.some((time) => {
      return currentTime >= time.Start && currentTime <= time.End;
    });
  });
};
