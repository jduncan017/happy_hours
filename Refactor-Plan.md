# HappyHourHunt Refactoring Plan

## Overview

This document outlines opportunities for improving code organization, performance, and maintainability in the HappyHourHunt Next.js application based on comprehensive architecture analysis.

---

## ✅ **PRIORITY 3: Performance Optimizations - PARTIALLY COMPLETED**

### Google Maps Performance

**File**: `src/app/Components/GoogleMap.tsx`

#### 🔄 Marker Diffing Algorithm - FUTURE ENHANCEMENT

- **Issue**: Recreates all markers when restaurant list changes
- **Impact**: Performance degradation with 100+ restaurants
- **Solution**: Implement marker diffing to only update changed markers
- **Status**: Not critical for current dataset size, deferred to future optimization

#### 🔄 Memory Cleanup - FUTURE ENHANCEMENT

- **Issue**: Google Maps instances may not be properly cleaned up
- **Solution**: Improve useEffect cleanup functions
- **Status**: Current implementation appears stable, monitor for memory leaks

### ✅ Filter Performance - COMPLETED

**File**: `src/app/Components/searchPage.tsx:114-144`

#### ✅ Memoization - ALREADY IMPLEMENTED

- **Status**: VERIFIED - `useMemo` already properly implemented for filter calculations
- **Implementation**: Line 115-150 uses `useMemo` with proper dependencies
- **Impact**: Filter calculations are properly memoized to prevent unnecessary re-computation

---

## 🔄 **PRIORITY 4: Code Organization**

### Extract Utility Functions

#### 1. Time Conversion Utilities

**Duplicate Logic in:**

- `src/app/Components/searchPage.tsx:18-36`
- `src/app/Components/HappyHourDisplay.tsx`

**Proposed**: `src/utils/timeUtils.ts`

- `timeToMinutes(timeString: string): number`
- `formatTimeRange(start: string, end: string): string`
- `isTimeInRange(current: string, start: string, end: string): boolean`

#### 2. Restaurant Filter Utilities

**Current**: Logic spread across multiple files
**Proposed**: Consolidate in `src/utils/restaurantUtils.ts`

- Move complex filtering logic from components
- Create composable filter functions

### Extract Custom Hooks

#### 1. Filter State Management

**Current**: Filter state managed in `searchPage.tsx`
**Proposed**: `src/hooks/useRestaurantFilters.ts`

```typescript
interface FilterOptions {
  searchQuery: string;
  filterType: "all" | "today" | "now";
  advancedFilters: AdvancedFilterOptions;
  timeFilter: TimeFilter | null;
}

export const useRestaurantFilters = (restaurants: Restaurant[]) => {
  // Centralized filter logic with memoization
};
```

#### 2. Map State Management

**Current**: Map state scattered in GoogleMap component
**Proposed**: `src/hooks/useGoogleMap.ts`

- Encapsulate map initialization
- Handle marker management
- Manage info window state

---

## 📦 **PRIORITY 6: Bundle Optimization**

### Code Splitting Opportunities

#### 1. Modal Components

**Current**: All modals loaded upfront
**Action**: Implement dynamic imports for modal components

#### 2. Map Components

**Current**: Google Maps loaded immediately
**Action**: Lazy load map components until needed

### Dependency Analysis

**Action**: Analyze bundle size and identify optimization opportunities

- Check for unused dependencies
- Optimize image loading strategies
- Review font loading

---

## 🧪 **PRIORITY 7: Developer Experience**

### Type Safety Improvements

#### 1. Strict Props Interfaces

**Action**: Review and strengthen TypeScript interfaces

- Add more specific types where `any` is used
- Create discriminated unions for variant props

#### 2. Error Handling Patterns

**Action**: Standardize error handling across components

- Create error boundary components
- Implement consistent error reporting

### Development Tools

**Action**: Enhance development experience

- Add more detailed prop validation
- Improve component debugging information
- Consider adding Storybook for component development

---

## 📊 **PRIORITY 8: Architecture Patterns**

### State Management

**Current**: Local state and React Query
**Future Consideration**: As app grows, consider:

- Zustand for global client state
- React Query for server state (already implemented)

### Component Composition

**Action**: Review component composition patterns

- Implement compound component patterns where appropriate
- Use render props for complex reusable logic

---

## 🚀 **Implementation Strategy**

### Phase 1: Quick Wins (1-2 days)

1. Remove unused code
2. Create LoadingSpinner and ErrorState components
3. Extract time utilities

### Phase 2: Performance (3-5 days)

1. Implement marker diffing
2. Add filter memoization
3. Bundle optimization

### Phase 3: Organization (1-2 weeks)

1. Extract custom hooks
2. Consolidate styling patterns
3. Improve type safety

### Phase 4: Architecture (Ongoing)

1. Monitor performance metrics
2. Refine patterns based on usage
3. Plan for future scalability

---

## 🔬 **DEEP ANALYSIS: Additional Opportunities**

### Critical Performance Issues

#### **Missing Memoization - HIGH PRIORITY**

**Location**: `src/app/Components/searchPage.tsx:114-144`

- Complex filter calculation runs on every render
- No memoization of expensive operations
- **Impact**: Causes unnecessary re-renders with large datasets
- **Solution**: Move filtering logic to `useMemo` with proper dependencies

#### **Component Re-render Optimization - HIGH PRIORITY**

**Missing `React.memo` on:**

- `RestaurantCard` (renders 50+ times per filter change)
- `HappyHourDisplay`
- `FilterButton`
- **Impact**: Unnecessary re-renders on filter state changes

### Reusable Function Extraction

#### **Time Utilities Consolidation - HIGH PRIORITY**

**Duplicate Logic in:**

- `searchPage.tsx:18-36` - `timeToMinutes()` function
- `HappyHourDisplay.tsx:25-40` - 12-hour formatting
- `LocationSearch.tsx:13-31` - Another time calculation

**Proposed**: `src/utils/time/timeUtils.ts`

```typescript
export const timeToMinutes = (timeString: string): number => {
  /* restaurant day conversion */
};
export const formatTime12Hour = (time: string): string => {
  /* 12-hour display */
};
export const isTimeInRestaurantDay = (time: string): boolean => {
  /* validation */
};
export const getCurrentDayOfWeek = (): string => {
  /* day calculation */
};
```

#### **Distance Calculation - MEDIUM PRIORITY**

**Location**: `LocationSearch.tsx:13-31`

- Haversine formula implementation
- **Move to**: `src/utils/geo/geoUtils.ts`

#### **Search Processing - MEDIUM PRIORITY**

**Location**: `searchPage.tsx:96-112`

- Text tokenization and matching logic
- **Extract to**: `src/utils/search/searchUtils.ts`

### Custom Hook Opportunities

#### **Time-based Filtering Hook - HIGH PRIORITY**

**Current State**: Time filtering logic scattered across:

- `searchPage.tsx` - `filterRestaurantsByTimeRange`
- `LocationSearch.tsx` - `hasHappyHourNow`
- `happyHourUtils.ts` - `filterHappyHoursNow`

**Solution**: `src/hooks/useTimeBasedFiltering.ts`

```typescript
export const useTimeBasedFiltering = (restaurants: Restaurant[]) => {
  return useMemo(
    () => ({
      filterByTimeRange: (timeFilter: TimeFilter) => {
        /* unified logic */
      },
      filterByNow: () => {
        /* consolidated from all sources */
      },
      filterByToday: (day: string) => {
        /* existing logic */
      },
    }),
    [restaurants],
  );
};
```

#### **Unified Filter State Hook - HIGH PRIORITY**

**Location**: `searchPage.tsx:61-84`

- Complex filter state management could be extracted
- **Create**: `src/hooks/useRestaurantFilters.ts`

#### **Map Interaction Hook - MEDIUM PRIORITY**

**Location**: `GoogleMap.tsx:85-181`

- Map initialization and marker management
- **Extract to**: `src/hooks/useGoogleMap.ts`

### Type System Improvements

#### **Remove 'any' Types - HIGH PRIORITY**

**Critical Locations:**

- `src/lib/supabase/restaurants.ts:14,15,25,72` - PostGIS coordinate types
- `src/scripts/migrate-data.ts:45` - Supabase response types

**Impact**: Type safety compromised in critical data handling

#### **Discriminated Unions - MEDIUM PRIORITY**

**Filter State Type Safety:**

```typescript
type FilterState =
  | { type: "all" }
  | { type: "today"; day: string }
  | { type: "now"; currentTime: string }
  | { type: "time-range"; filter: TimeFilter };
```

### Styling System Issues

#### **Color System Inconsistencies - MEDIUM PRIORITY**

**Issue**: Mixed usage of custom vs standard Tailwind colors

- Custom: `py1`, `po1`, `pr1`, `n1`, `n2`, `n3`
- Standard: `stone-300`, `gray-200`, `red-50`
- **Location**: Particularly problematic in `AdvancedFilters.tsx`

#### **Repeated Layout Patterns - HIGH PRIORITY**

**Common Patterns:**

- `"flex w-full flex-col gap-2"` - used 15+ times
- `"max-w-[1000px]"` - hardcoded width values
- `"border border-gray-200 rounded-lg bg-white shadow-themeShadow"` - card pattern

**Solution**: Compound layout components

```typescript
// src/app/Components/Layout/Card.tsx
// src/app/Components/Layout/FlexContainer.tsx
// src/app/Components/Layout/MaxWidthContainer.tsx
```

### File Organization Issues

#### **Mixed File Extensions - MEDIUM PRIORITY**

**Inconsistent TypeScript usage:**

- `src/utils/PreLoader/ImageLoadingWrapper.jsx` → should be `.tsx`
- `src/utils/PreLoader/PreLoader.jsx` → should be `.tsx`

#### **✅ Utils Structure Improvement - COMPLETED**

**Status**: ✅ **COMPLETED** - Utils folder reorganized with logical structure

**Completed Structure:**

✅ `src/utils/time/` - Time conversion and formatting utilities
✅ `src/utils/geo/` - Geographic and mapping utilities  
✅ `src/utils/search/` - Search and filtering utilities
✅ `src/utils/image/` - Image processing and loading utilities
✅ `src/utils/performance/` - Performance monitoring utilities
✅ Moved PreLoader components to proper image utilities location

### Error Handling Gaps

#### **Missing Error Boundaries - HIGH PRIORITY**

**No error boundaries around:**

- Google Maps component (frequent API failures)
- Image loading components
- Search results (data fetching errors)

#### **Inconsistent Error Patterns - MEDIUM PRIORITY**

**Different approaches:**

- `searchPage.tsx:183` - Basic `console.error`
- `GoogleMap.tsx:50-53` - Proper error state UI
- `ImageLoadingWrapper.jsx:46-51` - Console warning only

### Testing & Developer Experience

#### **✅ Critical Test Coverage - COMPLETED**

**Status**: ✅ **COMPLETED** - Comprehensive test coverage implemented

**Completed Test Files:**

✅ `src/utils/__tests__/timeUtils.test.ts` - Time conversion and formatting tests
✅ `src/hooks/__tests__/useTimeBasedFiltering.test.ts` - Time-based filtering logic tests
✅ Jest configuration with separate environments for utils and hooks

#### **✅ Performance Monitoring - COMPLETED**

**Status**: ✅ **COMPLETED** - Performance monitoring system implemented

**Completed Features:**

✅ `src/utils/performance/performanceMonitor.ts` - Comprehensive performance tracking
✅ Filter performance monitoring with automatic slow operation warnings
✅ Web Vitals tracking (LCP, CLS) with PerformanceObserver
✅ Custom metric tracking for restaurant filtering and map rendering
✅ Development-time performance debugging and reporting

### ✅ Accessibility Issues - COMPLETED

#### **✅ Critical A11y Implementation - COMPLETED**

**Status**: ✅ **COMPLETED** - Comprehensive accessibility improvements

**Completed Features:**

✅ ARIA labels on all interactive elements (buttons, links, form controls)
✅ Proper semantic HTML roles (search, toolbar, article, complementary)
✅ Focus management utilities in `src/hooks/useAccessibility.ts`
✅ Screen reader announcements and live regions
✅ Keyboard navigation support with arrow keys and activation handlers
✅ Skip navigation links for main content
✅ Enhanced button accessibility (proper button elements vs div+onClick)
✅ Descriptive alt text and aria-labels throughout the application

### Security Considerations

#### **API Security - MEDIUM PRIORITY**

- Google Maps API key exposure mitigation
- Input sanitization for search queries
- Rate limiting for location-based searches

---

## 🎯 **UPDATED PRIORITY MATRIX**

### ✅ **MEDIUM PRIORITY - PARTIALLY COMPLETED**

1. ✅ **File extension consistency** - Converted .jsx files to .tsx with proper TypeScript types (PreLoader.tsx, ImageLoadingWrapper.tsx)
2. ⏳ **Utils folder reorganization** - Time utilities consolidated, additional organization deferred
3. ✅ **Custom hook extraction** - Completed time-based filtering hook, map hooks deferred
4. ⏳ **Performance monitoring setup** - Deferred to future sprint
5. ⏳ **Accessibility improvements** - Deferred to future sprint

### **LOW PRIORITY (Future)**

1. Developer tooling (Storybook)
2. Documentation improvements
3. Advanced bundle optimization

---

### 🎯 **NEXT SPRINT TARGETS (Sprint 3)**

**PRIORITY**:

- [ ] Implement Google Maps marker diffing for performance
- [ ] Create comprehensive style guide documentation

**MEDIUM PRIORITY**:

- [ ] Extract map interaction hooks

**NICE TO HAVE**:

- [ ] Bundle analysis and optimization
- [ ] Storybook component documentation

---

_This plan will be updated as improvements are implemented and new opportunities are identified._
