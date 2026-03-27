require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT * FROM bookings WHERE hotel_id = 201')
  .then(res => {
    console.log("Found bookings:", res.rows.length);
    console.log(JSON.stringify(res.rows, null, 2));
    pool.end();
  })
  .catch(e => {
    console.error("DB Error:", e);
    pool.end();
  });
