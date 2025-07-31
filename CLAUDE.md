# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HappyHourHunt is a Next.js web application for discovering happy hour deals in Denver, CO. The application is built with TypeScript, React, and Tailwind CSS, featuring a modern responsive design with custom branding and color scheme.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture

### Core Data Structure

The application centers around a static data structure in `src/lib/hh_list.ts` containing restaurant information and happy hour schedules. The main data types are:

- `Restaurant` - Contains name, address, area, website, happy hours schedule, and notes
- `HappyHours` - Maps days of the week to time ranges
- `HappyHoursData` - Top-level structure organizing by state/city

### Key Components

- **Layout (`src/app/layout.tsx`)** - Root layout with navigation, footer, modal provider, and analytics
- **SearchPage (`src/app/Components/searchPage.tsx`)** - Main component displaying restaurant cards with filtering capabilities (all, today, now)
- **ModalContext (`src/contexts/ModalContext.tsx`)** - Global modal state management using React Context
- **Utils (`src/utils/happyHourUtils.ts`)** - Core business logic for sorting and filtering restaurants by time/day

### Component Organization

Components are organized in `src/app/Components/` with:

- Main components at root level
- `SmallComponents/` for reusable UI elements
- `modals/` for modal components
- `hamburgerMenu/` for mobile navigation

### Styling

- Uses Tailwind CSS with custom configuration in `tailwind.config.ts`
- Custom color palette with primary (#004e59), n2 (#fff9ee), and accent colors
- Custom fonts: Montserrat (sans), Playfair (serif), Allerta
- Responsive design with custom breakpoint `xs: 460px`

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

## Development Guardrails

### Styling Standards

1. **Always use Tailwind CSS** - Never use inline styles unless absolutely necessary
2. **ThemeContext for inline styles** - When inline styles are required, reference theme values from ThemeContext instead of hex codes
3. **PascalCase className prefixes** - Start every Tailwind className with a PascalCase descriptor (e.g., `"CTAButton"`, `"RestaurantCard"`)

### Code Standards

4. **Single responsibility** - Focus on single-use functions and components for easy navigation and readability
5. **Reusability over specificity** - Create reusable base components using Props, CVA, and CLSX for variants. Style variants when used, not as sub-components
6. **No anticipatory features** - Never add functionality that isn't currently needed
7. **Test new code** - Validate functionality with tests when appropriate

### Organization

8. **Smart file organization** - Keep directory structure logical and group related functionality together
9. **Document crucial components** - Note important workflows, components, and architectural decisions for future reference

## Data Migration & PostGIS Patterns

### Common Pitfalls & Best Practices

#### PostGIS Integration Patterns

- **Column Types**: Use `geometry(Point, 4326)` not PostgreSQL `POINT` for PostGIS functions
- **Coordinate Format**: PostGIS returns GeoJSON objects `{coordinates: [lng, lat]}`, not simple arrays
- **Transform Pattern**: Extract coordinates as `row.coordinates.coordinates[0]` (lng) and `[1]` (lat)

#### Complex Migration Strategy

- **Multi-step approach**: Break complex operations (enum casting + PostGIS) into separate steps
- **Function-based updates**: Create PostgreSQL functions for complex coordinate operations
- **Incremental verification**: Test each step before proceeding to the next

#### Database Function Patterns

- **Parameter order matters**: Required parameters before optional ones with defaults
- **Explicit casting**: Use `::enum_type` for type safety in SQL functions
- **Permission management**: Always grant `EXECUTE` to both `authenticated` and `service_role`

#### Migration Debugging Workflow

1. **Isolated testing**: Create small test scripts for individual components
2. **Raw data inspection**: Query database directly to understand stored formats
3. **API verification**: Test transformation layer with curl/jq
4. **Incremental fixes**: Address one issue at a time, verify before continuing

### Geocoding Integration

- **Caching strategy**: Implement caching to avoid API rate limits during development
- **Address enhancement**: Supplement partial addresses with city/state for better accuracy
- **API restrictions**: Temporarily disable website restrictions during development if needed

## Phase 1 Completion (Architectural Modernization)

### Major Accomplishments

#### Component Architecture Refactor
- **SearchPage Decomposition**: Broke down 320+ line monolithic component into focused modules:
  - `RestaurantCard` - Individual restaurant display logic
  - `RestaurantList` - List management with expansion state
  - `SearchFilters` - Filter controls and hero section
  - `HappyHourDisplay` - Time formatting and display
  - `Pagination` - Ready for future pagination needs

#### Modern Data Fetching
- **React Query Integration**: Replaced manual fetch/useState patterns with TanStack Query
- **Intelligent Caching**: 5-minute stale time, 10-minute garbage collection
- **Error Handling**: Automatic retries with proper error states
- **Developer Experience**: React Query DevTools for debugging

#### API Architecture Enhancement
- **Pagination Support**: Added pagination to `/api/restaurants` endpoint
- **Backward Compatibility**: Created `useAllRestaurants()` hook for existing usage
- **Response Standardization**: Consistent pagination metadata structure

#### Data Quality Improvements
- **Duplicate Cleanup**: Removed 12 duplicate restaurants (102 → 90 total)
- **Migration Scripts**: Automated duplicate detection and cleanup
- **Quality Verification**: Established data validation patterns

### Development Best Practices Established

#### React Query Patterns
- **Custom Hooks**: Encapsulate query logic in reusable hooks
- **Query Keys**: Structured keys for efficient cache management
- **Loading States**: Differentiate between `isLoading` (first load) and `isFetching` (background updates)

#### Component Design Principles
- **Single Responsibility**: Each component handles one concern
- **Props Interface**: Clean, typed interfaces for component communication
- **State Management**: Local state where appropriate, lifted state for shared concerns

#### Performance Optimizations
- **Component Splitting**: Reduced bundle size through focused components
- **Query Caching**: Eliminated redundant API calls
- **Bundle Analysis**: Confirmed no regression in build size

### Technical Debt Addressed
- **File Organization**: Removed duplicate files, standardized naming
- **Type Safety**: Full TypeScript coverage for new components
- **Error Boundaries**: Proper error handling throughout data flow
- **Build Verification**: All changes pass lint and build checks

### Ready for Phase 2
The architecture is now scalable and modern, with proper separation of concerns and data fetching patterns that will support the upcoming Google Maps integration and location-based features.
