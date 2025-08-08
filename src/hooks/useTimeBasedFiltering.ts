import { useMemo } from "react";
import type { Restaurant } from "@/lib/types";
import type { TimeFilter } from "@/app/Components/modals/TimeFilterModal";
import { 
  timeToMinutes, 
  getCurrentTime, 
  getCurrentDayOfWeek,
  isTimeInRange 
} from "@/utils/time/timeUtils";

/**
 * Custom hook for time-based restaurant filtering
 * Consolidates all time-related filtering logic in one place
 */
export const useTimeBasedFiltering = (restaurants: Restaurant[]) => {
  return useMemo(() => ({
    /**
     * Filter restaurants by custom time range
     */
    filterByTimeRange: (timeFilter: TimeFilter): Restaurant[] => {
      return restaurants.filter(restaurant => {
        const dayHours = restaurant.happyHours[timeFilter.dayOfWeek];
        if (!dayHours || dayHours.length === 0) return false;

        const filterStartMinutes = timeToMinutes(timeFilter.startTime);
        const filterEndMinutes = timeToMinutes(timeFilter.endTime);

        return dayHours.some(timeRange => {
          const happyHourStartMinutes = timeToMinutes(timeRange.Start);
          const happyHourEndMinutes = timeToMinutes(timeRange.End);

          // Check if there's any overlap between the filter time range and happy hour time range
          return (
            (happyHourStartMinutes <= filterEndMinutes && happyHourEndMinutes >= filterStartMinutes) ||
            (filterStartMinutes <= happyHourEndMinutes && filterEndMinutes >= happyHourStartMinutes)
          );
        });
      });
    },

    /**
     * Filter restaurants that have happy hour right now
     */
    filterByNow: (today: string): Restaurant[] => {
      const currentTime = getCurrentTime();
      
      return restaurants.filter(restaurant => {
        const todayHours = restaurant.happyHours[today];
        if (!todayHours || todayHours.length === 0) return false;

        return todayHours.some(timeRange => 
          isTimeInRange(currentTime, timeRange.Start, timeRange.End)
        );
      });
    },

    /**
     * Filter restaurants that have any happy hour today
     */
    filterByToday: (today: string): Restaurant[] => {
      return restaurants.filter(restaurant => {
        const todayHours = restaurant.happyHours[today];
        return todayHours && todayHours.length > 0;
      });
    },

    /**
     * Check if a restaurant has happy hour at current time
     */
    hasHappyHourNow: (restaurant: Restaurant): boolean => {
      const today = getCurrentDayOfWeek();
      const currentTime = getCurrentTime();
      const todayHours = restaurant.happyHours[today];
      
      if (!todayHours || todayHours.length === 0) return false;

      return todayHours.some(timeRange => 
        isTimeInRange(currentTime, timeRange.Start, timeRange.End)
      );
    },

    /**
     * Get current day and time for filtering
     */
    getCurrentContext: () => ({
      today: getCurrentDayOfWeek(),
      currentTime: getCurrentTime(),
    }),
  }), [restaurants]);
};