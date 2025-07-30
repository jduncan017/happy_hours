#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables in .env.local:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSingleStatement(statement: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('exec', { sql: statement });
    if (error) {
      console.error('SQL Error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Connection Error:', error);
    return false;
  }
}

async function setupInitialTables() {
  console.log('🚀 Setting up database tables...');

  // Create tables step by step
  const steps = [
    {
      name: 'Enable extensions',
      sql: `
        CREATE EXTENSION IF NOT EXISTS postgis;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `
    },
    {
      name: 'Create enum types',
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_category') THEN
            CREATE TYPE price_category AS ENUM ('1', '2', '3', '4');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deal_category') THEN
            CREATE TYPE deal_category AS ENUM ('food', 'drink', 'both');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'day_of_week') THEN
            CREATE TYPE day_of_week AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
          END IF;
        END
        $$;
      `
    },
    {
      name: 'Create restaurants table',
      sql: `
        CREATE TABLE IF NOT EXISTS restaurants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          coordinates POINT,
          area VARCHAR(100),
          cuisine_type VARCHAR(100),
          price_category price_category DEFAULT '2',
          website TEXT,
          menu_url TEXT,
          hero_image TEXT NOT NULL DEFAULT '/photo-missing.webp',
          images TEXT[] DEFAULT '{}',
          happy_hours JSONB NOT NULL DEFAULT '{}',
          notes TEXT[] DEFAULT '{}',
          verified BOOLEAN DEFAULT FALSE,
          created_by UUID REFERENCES auth.users(id),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];

  for (const step of steps) {
    console.log(`🔄 ${step.name}...`);
    const success = await runSingleStatement(step.sql);
    if (!success) {
      console.error(`❌ Failed: ${step.name}`);
      return false;
    }
    console.log(`✅ ${step.name} completed`);
  }

  console.log('✅ Database setup completed!');
  return true;
}

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
}

async function main() {
  console.log('🔧 Setting up remote Supabase database...');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to database. Check your environment variables.');
    process.exit(1);
  }

  // Setup database
  const success = await setupInitialTables();
  if (!success) {
    console.error('❌ Database setup failed');
    process.exit(1);
  }

  console.log('🎉 Setup complete! You can now:');
  console.log('1. Visit your Supabase dashboard to see the tables');
  console.log('2. Run npm run dev to test the application');
  console.log('3. Import your existing restaurant data');
}

main();