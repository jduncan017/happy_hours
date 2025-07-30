# Database Setup Guide

## Prerequisites

1. **Create a Supabase Project**
   - Go to [database.new](https://database.new)
   - Create a new project
   - Note your project URL and API keys

2. **Configure Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

## Database Schema

Our database includes these key tables:

- **restaurants** - Main restaurant data with PostGIS geospatial support
- **deals** - Happy hour deals and specials
- **restaurant_ratings** - Aggregated ratings (food, drink, service, atmosphere, price)
- **reviews** - Individual user reviews
- **restaurant_images** - Photo management with approval workflow
- **restaurant_submissions** - User-submitted restaurants pending approval
- **edit_suggestions** - Community editing with upvoting system

## Features

### Geospatial Queries
- PostGIS extension for location-based searches
- `restaurants_within_radius()` function for finding nearby restaurants
- Efficient spatial indexing

### Row Level Security (RLS)
- Public read access for restaurant data
- User-specific write permissions
- Restaurant owner verification system

### Authentication Integration
- Supabase Auth integration with Next.js middleware
- Cookie-based sessions
- Automatic token refresh

## Setup Commands

1. **Initialize Database**
   ```bash
   npm run db:setup
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

## Next Steps After Setup

1. **Test Database Connection**
   - The app should now connect to Supabase
   - Check browser console for any connection errors

2. **Create Test Data**
   - Use the migration script in Phase 1D to populate with existing restaurant data
   - Test creating a new restaurant through the API

3. **Verify Authentication**
   - Test user registration and login flows
   - Ensure middleware is working correctly

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify environment variables are set correctly
   - Check Supabase project is active and accessible

2. **Migration Failures**
   - Ensure you have service role key (not just anon key)
   - Check Supabase logs for detailed error messages

3. **RLS Policy Issues**
   - Policies may prevent certain operations
   - Use Supabase dashboard to test queries manually

### Debug Commands

```bash
# Test database connection
npm run test

# Check TypeScript compilation
npm run build

# Run development with detailed logs
npm run dev
```

## Architecture Notes

### Client Pattern
- **Browser Client** (`src/lib/supabase/client.ts`) - For client components
- **Server Client** (`src/lib/supabase/server.ts`) - For server components and API routes
- **Middleware** (`src/middleware.ts`) - Handles authentication token refresh

### Data Layer
- Type-safe database operations in `src/lib/supabase/restaurants.ts`
- Zod validation for all inputs
- Transformation layer between database rows and application types

This setup provides a solid foundation for the enhanced HappyHourHunt application with real-time capabilities, user authentication, and geospatial features.