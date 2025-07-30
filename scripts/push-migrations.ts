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
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql: string) {
  const { error } = await supabase.rpc('execute_sql', { sql });
  return error;
}

async function runMigration(filename: string) {
  console.log(`🔄 Running migration: ${filename}`);
  
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', filename);
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    const error = await executeSQL(migrationSQL);
    
    if (error) {
      console.error(`❌ Error running migration ${filename}:`, error);
      return false;
    }
    
    console.log(`✅ Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error reading migration ${filename}:`, error);
    return false;
  }
}

async function createExecuteFunction() {
  console.log('🔧 Creating execute_sql function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION execute_sql(sql text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
      RETURN 'OK';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN SQLERRM;
    END;
    $$;
  `;
  
  const error = await executeSQL(createFunctionSQL);
  if (error) {
    console.log('⚠️  execute_sql function might already exist or have permissions issue');
  } else {
    console.log('✅ execute_sql function created');
  }
}

async function pushMigrations() {
  console.log('🚀 Pushing migrations to remote Supabase database...');
  
  await createExecuteFunction();
  
  const migrations = [
    '001_initial_schema.sql',
    '002_rls_policies.sql', 
    '003_geospatial_functions.sql'
  ];
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (!success) {
      console.error('❌ Migration push failed');
      process.exit(1);
    }
  }
  
  console.log('✅ All migrations pushed successfully!');
  console.log('🔧 Next steps:');
  console.log('1. Verify tables were created in Supabase dashboard');
  console.log('2. Test database connection with npm run dev');
  console.log('3. Run data migration to populate restaurants');
}

pushMigrations();