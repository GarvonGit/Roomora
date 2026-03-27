const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const script = `
DO $$
DECLARE
    i INT;
    j INT;
    booking_date DATE;
    guest_names TEXT[] := ARRAY['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Diya', 'Ananya', 'Aaradhya', 'Saanvi', 'Myra', 'Kavya', 'Avni', 'Aanya', 'Swara', 'Riya'];
    last_names TEXT[] := ARRAY['Patel', 'Sharma', 'Singh', 'Kumar', 'Das', 'Reddy', 'Chauhan', 'Shah', 'Verma', 'Gupta'];
    platforms TEXT[] := ARRAY['booking', 'airbnb'];
    room_types TEXT[] := ARRAY['Deluxe Room', 'Executive Suite', 'Sea View Premium'];
    prices INT[] := ARRAY[5000, 9000, 7500];
    rand_guest TEXT;
    rand_platform TEXT;
    rand_room TEXT;
    rand_price INT;
    random_days INT;
BEGIN
    DELETE FROM bookings WHERE hotel_id = 201 AND check_in < CURRENT_DATE - INTERVAL '10 days';
    
    -- For roughly 110 days (3 months + 18 days offset)
    FOR i IN 0..110 LOOP
        booking_date := CURRENT_DATE - (110 - i);
        
        -- Insert 1 to 4 bookings per day
        FOR j IN 1..((random() * 3)::int + 1) LOOP
            rand_guest := guest_names[(random() * 19 + 1)::int] || ' ' || last_names[(random() * 9 + 1)::int];
            rand_platform := platforms[(random() * 1 + 1)::int];
            
            random_days := (random() * 2)::int;
            rand_room := room_types[random_days + 1];
            rand_price := prices[random_days + 1];

            INSERT INTO bookings (
                hotel_id, platform_name, guest_name, room_type, price, check_in, check_out, status, created_at
            ) VALUES (
                201, rand_platform::platform_type, rand_guest, rand_room, rand_price, 
                booking_date, booking_date + INTERVAL '2 days', 
                'completed'::booking_status, booking_date
            );
        END LOOP;
    END LOOP;
END $$;
`;

pool.query(script)
  .then(() => {
    console.log("Historical Sales Data successfully seeded!");
    pool.end();
  })
  .catch(err => {
    console.error("Error seeding sales:", err);
    pool.end();
  });
