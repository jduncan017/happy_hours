# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HappyHourHunt is a Next.js web application for discovering happy hour deals in Denver, CO. The application is built with TypeScript, React, and Tailwind CSS, featuring a modern responsive design with custom branding and color scheme.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run comprehensive test suite (Jest with utils/hooks projects)
- `npm run test:watch` - Run tests in watch mode for development

## Claude Development Server Rules

**IMPORTANT**: When starting the development server for testing:
- Always use port 3001: `PORT=3001 npm run dev`
- Always kill the server when done: `kill $(lsof -t -i:3001)`
- Never leave development servers running after debugging


## Architecture

### Core Data Structure

The application centers around a static data structure in `src/lib/hh_list.ts` containing restaurant information and happy hour schedules. The main data types are:

- `Restaurant` - Contains name, address, area, website, happy hours schedule, and notes
- `HappyHours` - Maps days of the week to time ranges
- `HappyHoursData` - Top-level structure organizing by state/city

### Key Components

- **Layout (`src/app/layout.tsx`)** - Root layout with skip navigation, modal provider, React Query, and analytics
- **SearchPage (`src/app/Components/searchPage.tsx`)** - Main component with integrated performance monitoring and filtering
- **RestaurantCard (`src/app/Components/RestaurantCard.tsx`)** - Individual restaurant display with accessibility improvements
- **SearchFilters (`src/app/Components/SearchFilters.tsx`)** - Filter controls with ARIA labels and semantic HTML
- **ModalContext (`src/contexts/ModalContext.tsx`)** - Global modal state management using React Context
- **Performance Monitor (`src/utils/performance/performanceMonitor.ts`)** - Comprehensive performance tracking system

### Component Organization

**📋 See [STYLEGUIDE.md](./STYLEGUIDE.md) for complete component library documentation**

Components are organized in `src/app/Components/` with:

- **SmallComponents/**: Reusable UI library (FormField, ActionButton, AvatarUpload, etc.)
- **Layout/**: Container and layout components  
- **Feature folders**: Organized by functionality (profile, auth, search, etc.)
- **modals/**: Modal components with focus management
- **ErrorBoundary/**: Error handling components

### Styling

**📋 See [STYLEGUIDE.md](./STYLEGUIDE.md) for complete design system documentation**

- Uses Tailwind CSS with custom theme colors and responsive design
- Dark theme for backend pages (Profile, Admin), Light theme for frontend
- Comprehensive reusable component library with consistent theming

### Environment Requirements

- `NEXT_PUBLIC_BASE_URL` environment variable is required for metadata and OpenGraph configuration

## Path Aliases

- `@/*` maps to `./src/*` for cleaner imports

## Database Architecture (Supabase)

### Key Components

- **Supabase Integration**: Full authentication and database setup with Next.js-specific patterns
- **PostGIS Geospatial**: Location-based queries with `restaurants_within_radius()` function
- **Row Level Security**: Comprehensive RLS policies for data protection
- **Type Safety**: Generated database types with transformation layer

### Client Pattern

- `src/lib/supabase/client.ts` - Browser client for client components
- `src/lib/supabase/server.ts` - Server client for server components/API routes
- `src/middleware.ts` - Authentication token refresh middleware

### Database Schema

- `restaurants` - Main data with PostGIS coordinates
- `deals` - Happy hour specials linked to restaurants
- `restaurant_ratings` - Aggregated rating data
- `reviews` - Individual user reviews
- `restaurant_images` - Photo management with approval workflow
- `restaurant_submissions` - User-submitted restaurants pending approval
- `edit_suggestions` - Community editing with upvoting system

### Setup Commands

- `npm run db:setup` - Initialize database schema and functions (remote)
- `npm run db:start` - Start local Supabase stack
- `npm run db:reset` - Reset local database with migrations and seed data
- `npm run db:migrate` - Push migrations to remote database
- `npm run db:types` - Generate TypeScript types from database schema

### Environment Setup

1. Copy `.env.local.template` to `.env.local`
2. Fill in Supabase project credentials from dashboard
3. Choose local or remote development workflow
4. Run appropriate setup commands

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key for client operations
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key for server operations (keep secure!)
- `SUPABASE_DB_PASSWORD` - Database password for CLI operations
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps JavaScript API key
- `NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID` - Cloud-based map style ID with POIs hidden (optional)

## Development Guidelines

**📋 For complete styling standards, component library, and development guidelines, see [STYLEGUIDE.md](./STYLEGUIDE.md)**

### Quick Reference

- **Theme Strategy**: Dark for backend pages, Light for frontend pages
- **Component Library**: Use reusable components from SmallComponents/ directory
- **Styling**: Custom theme colors (po1, py1, pr1, n1-n3) with Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliance built into all components
- **TypeScript**: Full type safety with proper interfaces

### Development Workflow

1. **Check STYLEGUIDE.md** for existing reusable components before creating new ones
2. **Use theme-aware components** with `theme="light" | "dark"` props
3. **Follow accessibility patterns** established in the component library
4. **Update STYLEGUIDE.md** when creating new reusable components



## Next.js Client/Server Component Rules

**CRITICAL**: Follow these serialization rules:
- **Root-level only**: Only use `"use client"` at top-level entry points
- **Child components**: Remove `"use client"` from child components within a client boundary
- **Function props**: Components with `"use client"` cannot receive function props from Server Components
- **Serialize complex data**: Transform Dates and complex objects before passing to client components

## Google Maps Integration

**Key Points**:
- Uses cloud-based map styling with `NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID`
- `mapId` required for AdvancedMarkerElement but prevents traditional styling
- POIs hidden via cloud-based styling configuration
- Fallback to `"denver-happy-hour-map"` if env var not set

## Phase 2 Completion (Infrastructure & Developer Experience)

### ✅ **Utils Architecture Reorganization**

**Completed**: Modern utility organization with clear separation of concerns

#### New Utils Structure
```
src/utils/
├── time/                    # Time conversion and formatting
│   ├── timeUtils.ts         # Core time functions with restaurant day logic
│   └── __tests__/           # Comprehensive time utility tests
├── geo/                     # Geographic and mapping utilities
│   ├── generateMapsURL.ts   # Google Maps URL generation
│   └── geoUtils.ts          # Distance calculations (Haversine formula)
├── search/                  # Search and filtering utilities
│   ├── advancedFilterUtils.ts
│   └── searchUtils.ts       # Text processing and matching
├── image/                   # Image processing and loading
│   └── PreLoader/           # Image loading components
└── performance/             # Performance monitoring system
    └── performanceMonitor.ts
```

#### Key Time Utilities (`src/utils/time/timeUtils.ts`)
- `timeToMinutes(timeString)` - Converts time to minutes with restaurant day logic
- `formatTime12Hour(time)` - Converts 24h to 12h format
- `formatTimeRange(start, end)` - Formats time ranges for display
- `isTimeInRange(current, start, end)` - Time range validation
- `getCurrentDayOfWeek()` - Current day calculation

### ✅ **Performance Monitoring System**

**Architecture**: Comprehensive performance tracking with Web Vitals integration

#### Core Features (`src/utils/performance/performanceMonitor.ts`)
- **Filter Performance Tracking**: Monitors restaurant filtering with automatic slow operation warnings (>100ms)
- **Web Vitals Integration**: LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) tracking
- **Custom Metrics**: Structured tracking for filter operations and map rendering
- **Development Debugging**: Console warnings and performance summaries in dev mode
- **Production Ready**: Disabled in test environment, configurable via env variables


#### Performance Thresholds
- **Filter Operations**: Warns if >100ms
- **Map Rendering**: Warns if >500ms
- **Web Vitals**: LCP and CLS tracking via PerformanceObserver API

### ✅ **Comprehensive Accessibility Implementation**

**Philosophy**: WCAG 2.1 AA compliance with focus on keyboard navigation and screen reader support

#### Accessibility Architecture (`src/hooks/useAccessibility.ts`)
- **Focus Management**: Programmatic focus control with scroll-into-view
- **Keyboard Navigation**: Arrow key handling for lists, Enter/Space activation
- **Focus Trapping**: Modal and dropdown focus containment
- **Screen Reader Announcements**: Live regions with polite/assertive priorities
- **Skip Navigation**: Bypass repetitive content for keyboard users

#### Component-Level Accessibility

**SearchFilters**: 
- `role="search"` and `role="toolbar"` for semantic structure
- `aria-label` and `aria-expanded` for filter buttons
- `aria-live="polite"` for error announcements

**RestaurantCard**:
- `role="article"` for semantic restaurant information
- `aria-label` for restaurant details and actions
- `role="group"` for action buttons with descriptive labels
- `role="complementary"` for notes section

**HappyHourDisplay**:
- `role="region"` for happy hour information
- `aria-expanded` for show/hide functionality
- Proper button element instead of clickable div
- `aria-live` for dynamic content updates

#### Global Accessibility Features
- **Skip Links**: "Skip to main content" for keyboard users
- **Screen Reader Styles**: `.sr-only` class for screen reader-only content
- **Focus Indicators**: Enhanced focus styling with `.focus-visible`
- **Semantic HTML**: Proper heading hierarchy and landmark roles

### ✅ **Testing Infrastructure**

**Architecture**: Multi-environment Jest configuration with comprehensive coverage

#### Test Structure
```
jest.config.js                    # Multi-project configuration
├── utils project (node env)      # Pure utility function testing
│   ├── src/utils/**/__tests__/
│   └── src/lib/**/__tests__/
└── hooks project (jsdom env)     # React hook testing with DOM
    └── src/hooks/**/__tests__/
```

#### Test Coverage
- **Time Utils**: 15 tests covering time conversion, formatting, and validation
- **Hook Logic**: Time-based filtering verification
- **Edge Cases**: Restaurant day boundary logic (2 AM = next day)
- **Performance**: All tests <600ms execution

### ✅ **Error Handling & Resilience**

#### Enhanced Error Boundaries
- **Component Isolation**: ImageErrorFallback for image loading failures
- **Graceful Degradation**: Fallback UI for critical component failures
- **Development Debugging**: Detailed error information in dev mode

#### Error State Components
- **ErrorState**: Reusable error display with retry functionality
- **LoadingSpinner**: Consistent loading states with size variants
- **ARIA Live Regions**: Accessible error announcements

### ✅ **Development Experience Improvements**

#### Enhanced Props & Type Safety
- **MaxWidthContainer**: Extended to accept HTML div attributes
- **Accessibility Props**: ARIA attributes properly typed
- **Performance Types**: Structured metric interfaces

## Architecture Decision Records (ADRs)

### Key Architectural Decisions (ADRs)

1. **Multi-Environment Jest**: Separate projects for utils (node) and hooks (jsdom)
2. **Performance Monitoring**: Integrated directly into filtering logic for real-time insights
3. **Accessibility-First**: Built into components from start for WCAG 2.1 AA compliance
4. **Utils by Domain**: Organized by function (time, geo, search) for better discoverability

## Current Application State & Development Guidelines

### 🏁 **Phase 2 Complete - Ready for Feature Development**

The application has completed major architectural improvements and is now ready for feature development with:
- ✅ Modern component architecture with React Query
- ✅ Comprehensive performance monitoring
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Full test coverage for critical utilities
- ✅ Well-organized utility structure
- ✅ Enhanced error handling and resilience

### 🛠️ **Development Workflow**

#### Before Adding New Features
1. **Read this file** - Understand current architecture and patterns
2. **Check existing components** - Look for reusable components before creating new ones
3. **Follow accessibility patterns** - Use established ARIA patterns and semantic HTML
4. **Add tests** - Write tests for new utility functions and complex logic
5. **Monitor performance** - Use performance tracking for expensive operations

#### Component Development Pattern
1. **Check STYLEGUIDE.md** - Review existing components before creating new ones
2. **Start with accessibility** - Add ARIA labels, roles, and keyboard navigation
3. **Use theme-aware patterns** - Implement `theme="light" | "dark"` support
4. **Leverage established utilities** - Use existing time, geo, and search utilities
5. **Implement error boundaries** - Wrap potentially failing components
6. **Add performance monitoring** - Track expensive operations
7. **Write tests** - Focus on utility functions and critical logic
8. **Update STYLEGUIDE.md** - Document new reusable components

### 🗺️ **Key Integration Points**

#### Time-Based Features
- Use `src/utils/time/timeUtils.ts` for all time operations
- Restaurant day logic: 8 AM - 2 AM next day
- Time formatting consistently uses 12-hour format
- Custom hook: `useTimeBasedFiltering` for filtering logic

#### Performance Monitoring
- Import: `import { performanceMonitor } from '@/utils/performance/performanceMonitor'`
- Pattern: `const tracker = performanceMonitor.trackFilterPerformance(count, type); /* work */ tracker.end();`
- Automatic warnings for slow operations (>100ms filters, >500ms map rendering)

#### Accessibility Integration
- Import: `import { useAccessibility } from '@/hooks/useAccessibility'`
- Use semantic HTML roles: `search`, `toolbar`, `article`, `complementary`, `region`
- Add ARIA labels for all interactive elements
- Use `.sr-only` class for screen reader-only content

#### Error Handling
- Reusable components: `LoadingSpinner`, `ErrorState`
- Error boundaries around images and API calls
- Consistent error messaging with retry functionality

### 📊 **Performance Characteristics**

- **Restaurant Filtering**: Typically 10-50ms, warns if >100ms
- **Test Suite**: <600ms for full test run
- **Web Vitals**: LCP and CLS automatically monitored
- **Development warnings**: Automatic alerts for slow operations

### 🔮 **Future Development Priorities**

#### Next Phase: Maps & Location Features
**Prerequisites**: Current architecture supports advanced features
- Google Maps marker diffing for large datasets
- Location-based restaurant filtering
- Map performance monitoring integration


### 📝 **Maintenance Guidelines**

#### Regular Maintenance Tasks
- **Test Suite**: Should remain under 1 second execution time
- **Performance Monitoring**: Review slow operation warnings monthly
- **Accessibility**: Test with screen readers quarterly
- **Dependencies**: Update monthly, test thoroughly
- **Type Safety**: Address TypeScript strict mode violations

#### Code Quality Indicators
- **Zero ESLint errors**: `npm run lint` should always pass
- **All tests passing**: `npm test` should complete successfully
- **No accessibility violations**: Manual testing with keyboard navigation
- **Performance warnings**: Address any operations >100ms

### 📚 **Learning Resources & References**


## Development Command Reference

### Essential Commands
```bash
# Development
npm run dev                    # Start development server (port 3000)
PORT=3001 npm run dev         # Claude development server (port 3001)
npm run build                  # Production build
npm start                      # Start production server

# Quality Assurance  
npm run lint                   # ESLint code quality check
npm test                       # Run comprehensive test suite
npm run test:watch            # Tests in watch mode

# Database Operations
npm run db:setup              # Initialize remote database
npm run db:start              # Start local Supabase
npm run db:reset              # Reset with migrations and seed data
npm run db:types              # Generate TypeScript types
```

## 📝 Important Development Notes

**CRITICAL**: When creating new reusable components, always update [STYLEGUIDE.md](./STYLEGUIDE.md) with:
- Component documentation and purpose
- Props interface and usage examples
- Theme support and styling variants
- Accessibility features

This ensures the design system documentation stays current and useful for future development.


## Quick Architecture Reference

### File Structure Overview
```
src/
├── app/
│   ├── Components/           # React components
│   │   ├── SmallComponents/  # Reusable UI elements
│   │   ├── Layout/           # Layout components
│   │   ├── ErrorBoundary/    # Error handling
│   │   └── modals/           # Modal components
│   ├── layout.tsx           # Root layout with skip nav
│   └── globals.css          # Global styles + accessibility
├── hooks/                   # Custom React hooks
│   ├── useAccessibility.ts  # Accessibility utilities
│   ├── useTimeBasedFiltering.ts
│   └── __tests__/           # Hook tests (jsdom env)
├── utils/                   # Utility functions
│   ├── time/                # Time operations
│   ├── geo/                 # Geographic utilities
│   ├── search/              # Search/filtering
│   ├── image/               # Image processing
│   ├── performance/         # Performance monitoring
│   └── **/__tests__/        # Utility tests (node env)
├── lib/                     # Core libraries
│   ├── types.ts             # TypeScript definitions
│   └── supabase/            # Database client
└── contexts/                # React contexts
```

### Import Patterns
```typescript
// Utilities
import { timeToMinutes } from '@/utils/time/timeUtils';
import { performanceMonitor } from '@/utils/performance/performanceMonitor';

// Hooks  
import { useAccessibility } from '@/hooks/useAccessibility';
import { useTimeBasedFiltering } from '@/hooks/useTimeBasedFiltering';

// Components
import LoadingSpinner from '@/app/Components/SmallComponents/LoadingSpinner';
import ErrorState from '@/app/Components/SmallComponents/ErrorState';

// Types
import type { Restaurant, TimeFilter } from '@/lib/types';
```
