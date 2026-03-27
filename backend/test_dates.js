const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const month = '2026-02';
        const dateFilter = `AND to_char(created_at, 'YYYY-MM') = $2`;
        const params = [ 201, month ];
        const bookRes = await pool.query(`SELECT * FROM bookings WHERE hotel_id = $1 ${dateFilter} ORDER BY created_at ASC`, params);
        const userBookings = bookRes.rows;
        
        let trends = [];
        const grouped = {};
        let maxDay = new Date(month + '-01').getDate(); // minimal start
        userBookings.forEach(b => {
            const day = b.created_at.getDate();
            if (!grouped[day]) grouped[day] = 0;
            grouped[day] += Number(b.price || 0);
            if (day > maxDay) maxDay = day;
        });
        for(let i=1; i<=maxDay; i++) {
            trends.push({ name: `Day ${i}`, revenue: grouped[i] || 0, value: grouped[i] || 0 });
        }
        console.log("maxDay:", maxDay);
        console.log(JSON.stringify(trends.slice(0, 5), null, 2));
        pool.end();
    } catch(e) {
        console.error(e);
        pool.end();
    }
})();
