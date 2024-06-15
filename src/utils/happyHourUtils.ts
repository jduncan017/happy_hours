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
