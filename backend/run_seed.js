const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSeed() {
  try {
    let seedSql = fs.readFileSync(__dirname + '/seed.sql', 'utf8');
    
    // Add wipe script
    const wipeScript = `
      DELETE FROM bookings WHERE hotel_id = 201;
      DELETE FROM room_prices WHERE room_id IN (SELECT id FROM rooms WHERE hotel_id = 201);
      DELETE FROM room_inventory WHERE room_id IN (SELECT id FROM rooms WHERE hotel_id = 201);
      DELETE FROM ota_integrations WHERE hotel_id = 201;
      DELETE FROM rooms WHERE hotel_id = 201;
      DELETE FROM hotels WHERE id = 201;
      DELETE FROM users WHERE id = 101;
    `;
    
    seedSql = seedSql.replace('BEGIN;\n\n-- 👤 USER', 'BEGIN;\n' + wipeScript + '\n-- 👤 USER');
    
    await pool.query(seedSql);
    console.log("Successfully seeded database!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

runSeed();
