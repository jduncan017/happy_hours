# HappyHourHunt MVP Development Plan

## Overview
Transform HappyHourHunt from a static Denver happy hour site into a dynamic, user-driven platform with location-based search, community features, and comprehensive restaurant data.

## Phase 1: Core Infrastructure & Data Model (2-3 weeks)

### 1.1 Enhanced Data Structure
- [x] **Current**: Basic restaurant with name, address, happy hours, notes
- [x] **New**: Add cuisine type, price category, coordinates, deals, hero image, ratings
- **Tasks**:
  - [x] Update TypeScript interfaces in `src/lib/schemas.ts`
  - [x] Create migration script for existing data
  - [x] Add validation schemas

### 1.2 Supabase Database Setup
- **Database Tables**:
  - [x] `restaurants` - Enhanced restaurant data with coordinates
  - [x] `users` - User profiles and authentication  
  - [x] `reviews` - User ratings (food, drink, service, atmosphere, price)
  - [x] `restaurant_images` - Photo management system
  - [x] `edit_suggestions` - Community editing with upvoting
  - [x] `restaurant_submissions` - Pending restaurant additions
- **Features**:
  - [x] Row Level Security (RLS) policies
  - [x] PostGIS extension for geospatial queries
  - [x] Real-time subscriptions
  - [x] Automatic image optimization

### 1.3 Data Migration
- [x] Convert current static data to database
- [x] Add coordinates using Google Geocoding API
- [ ] Create admin interface for data management

## Phase 2: Enhanced Search & Maps (2-3 weeks)

### 2.1 Google Maps Integration
- **Components**:
  - [x] Interactive map view with restaurant markers
  - [x] Map/list toggle functionality
  - [x] Clustering for dense areas
- **API Requirements**:
  - [x] Google Maps JavaScript API
  - [x] Places API for autocomplete
  - [x] Geocoding API for address conversion

### 2.2 Location-Based Search
- **"Find Happy Hour Now" Button**:
  - [x] Get user's current location
  - [x] Search within 10-mile radius (configurable)
  - [x] Show currently active + starting within 1 hour
- **"Happy Hours Today" Button**:
  - [x] Same location logic
  - [x] Show all happy hours for current day
- **Features**:
  - [x] Geolocation permission handling
  - [ ] Fallback to manual location entry
  - [x] Distance calculations and sorting

### 2.3 Advanced Filtering System
- **Filters**:
  - [ ] Distance (1, 5, 10, 25 miles)
  - [ ] Cuisine type (dropdown with all available types)
  - [ ] Day of week (multi-select)
  - [ ] Time range (slider or time pickers)
  - [ ] Price category ($ to $$$$)
  - [ ] Location (zip code or address search)
- **UI/UX**:
  - [ ] Collapsible filter panel
  - [ ] Clear all filters button
  - [ ] Filter count indicators
  - [ ] Mobile-optimized filter drawer

## Phase 3: User System & Content Management (3-4 weeks)

### 3.1 User Authentication
- **Supabase Auth Integration**:
  - [ ] Email/password signup/login
  - [ ] Social logins (Google, Facebook)
  - [ ] Password reset functionality
- **User Profiles**:
  - [ ] Basic info (name, location, preferences)
  - [ ] Favorite restaurants
  - [ ] Review history
  - [ ] Submission history

### 3.2 Restaurant Submission System
- **User Submission Form**:
  - [ ] Restaurant URL input
  - [ ] Manual data entry fallback
  - [ ] Image upload capability
- **AI Web Crawler**:
  - [x] Extract restaurant info from website (OG image scraping implemented)
  - [ ] Find menu links and happy hour info
  - [x] Download hero image
  - [ ] Generate structured data for approval
- **Admin Approval Workflow**:
  - [ ] Review submitted restaurants
  - [ ] Edit/approve/reject submissions
  - [ ] Automated verification where possible

### 3.3 Restaurant Profile Management
- **Restaurant Owner Accounts**:
  - [ ] Claim existing restaurants
  - [ ] Update hours, deals, photos
  - [ ] Respond to reviews
- **Verification System**:
  - [ ] Email/phone verification for restaurant owners
  - [ ] Badge system for verified establishments

## Phase 4: Community Features (2-3 weeks)

### 4.1 Rating & Review System
- **5-Category Rating**:
  - [ ] Food, Drink, Service, Atmosphere, Price
  - [ ] Overall score calculation
  - [ ] Individual review display
- **Review Features**:
  - [ ] Text reviews with photos
  - [ ] Helpful/not helpful voting
  - [ ] Report inappropriate content
  - [ ] Response from restaurant owners

### 4.2 Photo System
- **User Photo Uploads**:
  - [ ] Multiple photos per restaurant
  - [ ] Photo categories (food, drinks, interior, exterior)
  - [ ] Moderation queue
- **Photo Feed**:
  - [ ] Instagram-style photo browsing
  - [ ] User photo attribution
  - [ ] Photo likes and comments

### 4.3 Community Editing
- **Edit Suggestions**:
  - [ ] Users suggest changes to restaurant info
  - [ ] Community upvoting system
  - [ ] Auto-approve after threshold (5+ upvotes)
- **Quality Control**:
  - [ ] User reputation system
  - [ ] Moderator review for major changes
  - [ ] Edit history tracking

## Phase 5: Monetization & Polish (1-2 weeks)

### 5.1 Advertising Integration
- **Ad Placements**:
  - [ ] Sponsored restaurant listings
  - [ ] Banner ads in search results
  - [ ] Native content integration
- **Ad Platforms**:
  - [ ] Google Ads integration
  - [ ] Direct restaurant partnerships
  - [ ] Local business directory listings

### 5.2 Performance & Analytics
- **Optimization**:
  - [x] Image lazy loading and optimization (Dynamic backgrounds, React Query caching)
  - [x] Database query optimization (PostGIS geospatial queries)
  - [x] Caching strategies (React Query, database-first image loading)
- **Analytics**:
  - [ ] User behavior tracking
  - [ ] Restaurant page views
  - [ ] Search pattern analysis
  - [ ] Revenue tracking

## Technical Stack

### Frontend
- **Current**: Next.js 14, TypeScript, Tailwind CSS
- **Additions**: 
  - Google Maps React components
  - Framer Motion for animations
  - React Hook Form for forms
  - Zustand for state management

### Backend & Database
- **Supabase**: 
  - PostgreSQL with PostGIS
  - Authentication
  - Real-time subscriptions
  - Storage for images
- **APIs**:
  - Google Maps APIs
  - Web scraping service (Puppeteer/Playwright)
  - Image processing (Sharp)

### Third-Party Services
- **Maps**: Google Maps Platform
- **AI/Scraping**: OpenAI API for data extraction
- **Analytics**: Vercel Analytics + Google Analytics
- **Ads**: Google AdSense

## Cost Estimates (Monthly)

- **Supabase Pro**: $25/month
- **Google Maps APIs**: $50-200/month (depending on usage)
- **OpenAI API**: $20-100/month
- **Vercel Pro**: $20/month
- **Total**: ~$115-345/month

## Success Metrics

### Phase 1-2
- Successfully migrate all existing data
- Maps integration working smoothly
- Location search accuracy >95%

### Phase 3-4  
- 10+ user-submitted restaurants per week
- 50+ active user accounts
- Average 4+ star ratings on submissions

### Phase 5
- $200+ monthly revenue from ads
- Break-even on operational costs
- 1000+ monthly active users

## Risk Mitigation

1. **API Costs**: Implement usage monitoring and caching
2. **Data Quality**: Strong validation and moderation systems
3. **User Adoption**: Gradual rollout with existing user base
4. **Competition**: Focus on Denver market expertise and community features

## Next Steps

1. Set up development environment with Supabase
2. Create enhanced data models and migrations
3. Begin Phase 1 implementation
4. Set up project management and tracking systems