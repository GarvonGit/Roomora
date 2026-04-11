const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('SUCCESS: Connected to Supabase!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Database time:', res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Could not connect to Supabase:', err.message);
    process.exit(1);
  });
