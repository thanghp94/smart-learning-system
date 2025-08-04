import { Pool } from '@neondatabase/serverless';

const DATABASE_URL = "postgresql://neondb_owner:npg_SFPy2onhbL4E@ep-late-thunder-a55gzmii.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function testConnection() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    console.log('Testing PostgreSQL connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result.rows[0]);
    
    // Test if students table exists and get count
    const studentsResult = await pool.query('SELECT COUNT(*) FROM students');
    console.log('✅ Students table accessible!');
    console.log('Students count:', studentsResult.rows[0].count);
    
    // Test if employees table exists and get count
    const employeesResult = await pool.query('SELECT COUNT(*) FROM employees');
    console.log('✅ Employees table accessible!');
    console.log('Employees count:', employeesResult.rows[0].count);
    
    // List all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('✅ Available tables:');
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
