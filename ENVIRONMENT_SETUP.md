# Environment Setup Guide

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com](https://supabase.com)
   - Create account or sign in
   - Click "New project"

2. **Project Configuration**
   - Choose organization
   - Enter project name: `denver-happy-hours`
   - Enter database password (save this!)
   - Select region (choose closest to your users)
   - Click "Create new project"

3. **Get Your Keys**
   - Go to Settings → API
   - Copy these values for your `.env.local`:
     - Project URL
     - `anon` `public` key
     - `service_role` `secret` key (⚠️ Keep this secure!)

## Step 2: Environment Configuration

1. **Copy the template:**
   ```bash
   cp .env.local.template .env.local
   ```

2. **Fill in your `.env.local` file:**
   ```env
   # Your domain (use localhost:3000 for development)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # From your Supabase project settings → API
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Your database password from step 1
   SUPABASE_DB_PASSWORD=your-secure-password

   # Optional - for later phases
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```

## Step 3: Database Setup Options

You have **two options** for setting up your database:

### Option A: Remote Setup (Recommended for production)

1. **Run migrations on your remote Supabase project:**
   ```bash
   # Link to your remote project
   npm run supabase -- link --project-ref your-project-ref

   # Push migrations to remote database
   npm run db:migrate
   ```

2. **Verify the setup:**
   ```bash
   # Generate types from remote database
   npm run supabase -- gen types typescript --linked > src/lib/supabase/database.types.ts
   ```

### Option B: Local Development Setup

1. **Start local Supabase stack:**
   ```bash
   # Start local Supabase (PostgreSQL, API, Dashboard, etc.)
   npm run db:start
   ```

2. **Setup local database:**
   ```bash
   # Reset local database with migrations
   npm run db:reset
   
   # Generate types from local database  
   npm run db:types
   ```

3. **Access local development tools:**
   - **Supabase Studio:** [http://127.0.0.1:54323](http://127.0.0.1:54323)
   - **Database:** [http://127.0.0.1:54322](http://127.0.0.1:54322) 
   - **API:** [http://127.0.0.1:54321](http://127.0.0.1:54321)
   - **Email Testing:** [http://127.0.0.1:54324](http://127.0.0.1:54324)

## Step 4: Verify Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Check the browser console:**
   - Visit [http://localhost:3000](http://localhost:3000)
   - Open Developer Tools → Console
   - Look for any Supabase connection errors

3. **Test database connection:**
   ```bash
   npm test
   npm run build
   ```

## Step 5: Initial Data Population

1. **Run the data migration script:**
   ```bash
   # This will populate your database with existing restaurant data
   npm run db:setup
   ```

## Available Commands

### Database Management
- `npm run db:start` - Start local Supabase stack
- `npm run db:stop` - Stop local Supabase stack  
- `npm run db:reset` - Reset local database with fresh migrations
- `npm run db:migrate` - Push local migrations to remote database
- `npm run db:types` - Generate TypeScript types from local database
- `npm run db:setup` - Run initial data setup script

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Supabase CLI
- `npm run supabase -- <command>` - Run any Supabase CLI command
- Example: `npm run supabase -- status` - Check local stack status

## Troubleshooting

### Common Issues

1. **"Failed to connect to Supabase"**
   - Check your environment variables are correct
   - Verify your Supabase project is active
   - Ensure you're using the correct API keys

2. **"Permission denied" errors**
   - Check if you're using the `service_role` key for admin operations
   - Verify RLS policies aren't blocking your operations

3. **Local Supabase won't start**
   - Make sure Docker is running
   - Check if ports 54321-54327 are available
   - Run `npm run db:stop` and try again

4. **Migration failures**
   - Check the migration files for syntax errors
   - Ensure you have proper permissions
   - Look at Supabase logs for detailed error messages

### Getting Help

- **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **Local Development Guide:** [https://supabase.com/docs/guides/local-development](https://supabase.com/docs/guides/local-development)
- **CLI Reference:** [https://supabase.com/docs/reference/cli](https://supabase.com/docs/reference/cli)

## Security Notes

⚠️ **Never commit your `.env.local` file to git!**

- The `.env.local` file is already in `.gitignore`
- Service role keys have admin access to your database
- Only use service role keys in secure server environments
- Use anon keys for client-side operations

## Next Steps

Once your environment is set up:

1. **Test authentication flow** - Try signing up a new user
2. **Create a test restaurant** - Use the database functions
3. **Explore Supabase Studio** - Familiarize yourself with the interface
4. **Set up your preferred database** (local vs remote for development)

Choose local development for faster iteration, or remote for production-like testing.