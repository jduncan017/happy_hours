/**
 * Search Strategy Utilities
 * Different search patterns for different cost scenarios
 */

import { useState, useEffect, useCallback } from "react";
import { Restaurant } from "@/lib/types";
import { applyRestaurantFilters, type RestaurantSearchFilters } from "./restaurantFilterUtils";

// Custom hook for debounced search (good for local data)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for search-on-enter strategy (good for expensive operations)
export function useSearchOnEnter<T extends RestaurantSearchFilters>(
  initialFilters: T,
  onSearch?: (filters: T) => void
) {
  const [pendingFilters, setPendingFilters] = useState<T>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<T>(initialFilters);
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = useCallback(async () => {
    setIsSearching(true);
    setAppliedFilters(pendingFilters);
    
    if (onSearch) {
      await onSearch(pendingFilters);
    }
    
    setIsSearching(false);
  }, [pendingFilters, onSearch]);

  const handleKeyPress = useCallback((event: KeyboardEvent | React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  }, [executeSearch]);

  const updateFilter = useCallback((key: keyof T, value: T[keyof T]) => {
    setPendingFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setPendingFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [initialFilters]);

  const hasChanges = JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  return {
    pendingFilters,
    appliedFilters,
    isSearching,
    hasChanges,
    updateFilter,
    executeSearch,
    handleKeyPress,
    clearFilters,
  };
}

// Cost-effective filtering strategy
export interface SearchStrategy {
  type: 'debounced' | 'on-enter' | 'hybrid';
  debounceMs?: number;
  expensiveOperations?: string[];
}

export function createOptimizedSearch(
  restaurants: Restaurant[],
  strategy: SearchStrategy = { type: 'debounced', debounceMs: 300 }
) {
  const isExpensiveOperation = (filterType: string) => {
    return strategy.expensiveOperations?.includes(filterType) ?? false;
  };

  const applyFilters = (filters: RestaurantSearchFilters) => {
    // Separate cheap and expensive operations
    const cheapFilters: RestaurantSearchFilters = {};
    const expensiveFilters: RestaurantSearchFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (isExpensiveOperation(key)) {
        expensiveFilters[key as keyof RestaurantSearchFilters] = value;
      } else {
        cheapFilters[key as keyof RestaurantSearchFilters] = value;
      }
    });

    // Apply cheap filters immediately (can be debounced)
    let result = applyRestaurantFilters(restaurants, cheapFilters);

    // Apply expensive filters only on explicit search
    if (Object.keys(expensiveFilters).length > 0) {
      result = applyRestaurantFilters(result, expensiveFilters);
    }

    return result;
  };

  return { applyFilters, isExpensiveOperation };
}

// Performance cost calculator
export function estimateSearchCost(
  dataSize: number,
  searchComplexity: 'simple' | 'medium' | 'complex',
  updateFrequency: 'realtime' | 'debounced' | 'on-enter'
): {
  estimatedOpsPerSecond: number;
  recommendation: string;
} {
  const complexityMultiplier = {
    simple: 1,     // Basic text search
    medium: 5,     // Multiple filters + sorting
    complex: 20,   // Time calculations + advanced filters
  };

  const frequencyMultiplier = {
    realtime: 10,   // Every keystroke
    debounced: 3,   // Every 300ms during typing
    'on-enter': 1,  // Only on search submission
  };

  const baseOps = dataSize * complexityMultiplier[searchComplexity];
  const estimatedOpsPerSecond = baseOps * frequencyMultiplier[updateFrequency];

  let recommendation = '';
  if (estimatedOpsPerSecond < 1000) {
    recommendation = 'Debounced search is fine - low computational cost';
  } else if (estimatedOpsPerSecond < 10000) {
    recommendation = 'Consider search-on-enter for better performance';
  } else {
    recommendation = 'Definitely use search-on-enter + server-side optimization';
  }

  return { estimatedOpsPerSecond, recommendation };
}

// Example usage:
// const cost = estimateSearchCost(1000, 'complex', 'debounced');
// console.log(cost.recommendation);