#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filename: string) {
  console.log(`Running migration: ${filename}`);
  
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', filename);
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error(`Error running migration ${filename}:`, error);
      return false;
    }
    
    console.log(`✅ Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`Error reading migration ${filename}:`, error);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...');
  
  const migrations = [
    '001_initial_schema.sql',
    '002_rls_policies.sql',
    '003_geospatial_functions.sql'
  ];
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (!success) {
      console.error('❌ Database setup failed');
      process.exit(1);
    }
  }
  
  console.log('✅ Database setup completed successfully!');
  console.log('🔧 Next steps:');
  console.log('1. Create your first restaurant entry');
  console.log('2. Test the authentication flow');
  console.log('3. Upload some test images');
}

// Create exec_sql function if it doesn't exist
async function createExecSqlFunction() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
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
    `
  });

  if (error) {
    // Function might not exist yet, let's create it directly
    console.log('Creating exec_sql function...');
  }
}

// Run setup
createExecSqlFunction().then(() => {
  setupDatabase();
});