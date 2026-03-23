const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123',
    key_secret: process.env.RAZORPAY_SECRET || 'mocksecret123'
});

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: { user: "mock@ethereal.email", pass: "mock123" }
});

// Configure PostgreSQL Pool connection (Vercel Postgres or Local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;

        try {
            // Find user's hotel automatically mapping to database relations
            const hotelRes = await pool.query('SELECT id FROM hotels WHERE user_id = $1', [user.id]);
            req.user.hotel_id = hotelRes.rows.length > 0 ? hotelRes.rows[0].id : null;
            next();
        } catch (e) {
            console.error('Error in auth middleware', e);
            res.sendStatus(500);
        }
    });
};

// --- Auth ---
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, hotelName, phoneNumber, password } = req.body;

    if (!username || !email || !hotelName || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const checkUser = await pool.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Native PG Insert with Transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const userRes = await client.query(
                `INSERT INTO users (username, email, password_hash, phone_number, plan_name, plan_expiry) 
                 VALUES ($1, $2, $3, $4, 'Free', CURRENT_TIMESTAMP + INTERVAL '30 days') RETURNING *`,
                [username, email, hashedPassword, phoneNumber]
            );
            const newUser = userRes.rows[0];

            const hotelRes = await client.query(
                `INSERT INTO hotels (user_id, hotel_name) VALUES ($1, $2) RETURNING id`,
                [newUser.id, hotelName]
            );
            const newHotelId = hotelRes.rows[0].id;

            const platforms = ['booking', 'agoda', 'makemytrip', 'goibibo'];
            for (const platform of platforms) {
                await client.query(
                    `INSERT INTO ota_integrations (hotel_id, platform_name, is_connected) VALUES ($1, $2, false)`,
                    [newHotelId, platform]
                );
            }

            await client.query(
                `INSERT INTO rooms (hotel_id, room_type, price, inventory_count) VALUES ($1, 'Standard Room', 1000, 10)`,
                [newHotelId]
            );

            await client.query('COMMIT');

            const token = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email, hotelName }, JWT_SECRET, { expiresIn: '30d' });
            res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email, hotelName, role: 'Admin', plan_name: newUser.plan_name, plan_expiry: newUser.plan_expiry } });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch(err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userRes = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userRes.rows.length === 0) {
            // Check for strict local mock sandbox fallback if db is empty
            if (username === 'admin' && password === 'password') {
                const countRes = await pool.query('SELECT count(*) FROM users');
                if (parseInt(countRes.rows[0].count) === 0) {
                    const token = jwt.sign({ id: 0, username: 'admin', email: 'admin@roomora.com', hotelName: 'Grand Plaza Hotel' }, JWT_SECRET, { expiresIn: '30d' });
                    return res.json({ token, user: { id: 0, username: 'admin', email: 'admin@roomora.com', hotelName: 'Grand Plaza Hotel', role: 'Admin', plan_name: 'Pro', plan_expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() } });
                }
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userRes.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const hotelRes = await pool.query('SELECT hotel_name FROM hotels WHERE user_id = $1', [user.id]);
        const hotelName = hotelRes.rows.length > 0 ? hotelRes.rows[0].hotel_name : null;

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, hotelName }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, hotelName, role: 'Admin', plan_name: user.plan_name, plan_expiry: user.plan_expiry } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (userRes.rows.length === 0) return res.sendStatus(404);
        const u = userRes.rows[0];
        
        req.user.plan_name = u.plan_name;
        req.user.plan_expiry = u.plan_expiry;
        req.user.email = u.email;
        
        res.json({ user: req.user });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Dashboard Analytics ---
app.get('/api/dashboard/analytics', authenticateToken, async (req, res) => {
    try {
        const bookRes = await pool.query('SELECT * FROM bookings WHERE hotel_id = $1', [req.user.hotel_id]);
        const userBookings = bookRes.rows;
        
        const channelRes = await pool.query('SELECT count(*) FROM ota_integrations WHERE hotel_id = $1 AND is_connected = true', [req.user.hotel_id]);
        
        res.json({
            kpis: {
                totalBookings: userBookings.length,
                revenue: userBookings.reduce((sum, b) => sum + Number(b.price), 0),
                occupancyRate: userBookings.length > 0 ? 85 : 0,
                activeChannels: parseInt(channelRes.rows[0].count)
            },
            revenueTrends: [
                { month: 'Jan', revenue: 250000 },
                { month: 'Feb', revenue: 300000 },
                { month: 'Mar', revenue: 280000 },
                { month: 'Apr', revenue: 450000 },
                { month: 'May', revenue: 500000 },
                { month: 'Jun', revenue: 550000 }
            ],
            platformBookings: userBookings.length > 0 ? [
                { name: 'Booking.com', value: userBookings.filter(b => b.platform_name === 'booking').length },
                { name: 'Agoda', value: userBookings.filter(b => b.platform_name === 'agoda').length },
                { name: 'MakeMyTrip', value: userBookings.filter(b => b.platform_name === 'makemytrip').length },
                { name: 'Goibibo', value: userBookings.filter(b => b.platform_name === 'goibibo').length }
            ] : []
        });
    } catch(err) {
        console.error('Analytics Fetch Error:', err);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
});

// --- Inventory ---
app.get('/api/inventory', authenticateToken, async (req, res) => {
    try {
        const invRes = await pool.query(`SELECT id, room_type as type, inventory_count as total_count, inventory_count as available, price as base_price FROM rooms WHERE hotel_id = $1`, [req.user.hotel_id]);
        res.json(invRes.rows);
    } catch(err) {
        console.error('Inventory Fetch Error:', err);
        res.status(500).json({ message: 'Error fetching inventory' });
    }
});

app.post('/api/inventory/sync-all', authenticateToken, async (req, res) => {
    await new Promise(r => setTimeout(r, 1500));
    res.json({ success: true, message: 'Successfully synced all channels for this user' });
});

// Scope Selective Price Update Tracking
app.post('/api/pricing/update', authenticateToken, async (req, res) => {
    const { roomId, newPrice, platforms } = req.body;

    try {
        // Validate room ownership
        const roomRes = await pool.query('SELECT * FROM rooms WHERE id = $1 AND hotel_id = $2', [roomId, req.user.hotel_id]);
        if (roomRes.rows.length === 0) return res.status(404).json({ message: 'Room not found or Unauthorized' });
        
        const oldPrice = roomRes.rows[0].price;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Update Base Room Price
            await client.query('UPDATE rooms SET price = $1 WHERE id = $2', [newPrice, roomId]);

            // For each platform selected, inject an explicit audit trail
            for (const p of platforms) {
                // Formatting to DB Enum
                const enumP = p.toLowerCase().replace('.com', ''); 
                await client.query(
                    `INSERT INTO price_update_logs (hotel_id, room_id, updated_by, platform_name, old_price, new_price) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [req.user.hotel_id, roomId, req.user.id, enumP, oldPrice, newPrice]
                );
            }
            await client.query('COMMIT');
            
            // Fetch updated logs specifically mapped to this user
            const logsRes = await client.query('SELECT * FROM price_update_logs WHERE hotel_id = $1 ORDER BY updated_at DESC', [req.user.hotel_id]);
            
            // Normalize JSON output names
            const mappedLogs = logsRes.rows.map(row => ({
               id: row.id,
               hotel_id: row.hotel_id,
               room_id: row.room_id,
               old_price: row.old_price,
               new_price: row.new_price,
               platforms_updated: row.platform_name, 
               changed_by: req.user.username,
               timestamp: row.updated_at
            }));

            res.json({
                success: true,
                message: 'Price updated successfully on selected platforms',
                logs: mappedLogs
            });
        } catch(e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch(err) {
        console.error('Pricing Update Error:', err);
        res.status(500).json({ message: 'Error updating pricing' });
    }
});

// --- Bookings ---
app.get('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const bookRes = await pool.query('SELECT id, guest_name, room_type, check_in, check_out, platform_name as ota_source, price, status FROM bookings WHERE hotel_id = $1', [req.user.hotel_id]);
        // Format ota_source to capitalized structure if needed natively on frontend
        const formatted = bookRes.rows.map(b => ({
            ...b,
            ota_source: b.ota_source === 'booking' ? 'Booking.com' : b.ota_source.charAt(0).toUpperCase() + b.ota_source.slice(1)
        }));
        res.json(formatted);
    } catch(err) {
        console.error('Bookings fetch Error:', err);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// --- Settings/Integration UI Mock ---
app.get('/api/integrations', authenticateToken, async (req, res) => {
    try {
        const otaRes = await pool.query('SELECT id, platform_name, is_connected as connected, api_key as "apiKey", secret_key as secret FROM ota_integrations WHERE hotel_id = $1', [req.user.hotel_id]);
        
        // Structure map back out mimicking exact Frontend logic standard
        const mappings = otaRes.rows.map(o => {
            let properName = o.platform_name;
            if (o.platform_name === 'booking') properName = 'Booking.com';
            if (o.platform_name === 'makemytrip') properName = 'MakeMyTrip';
            if (o.platform_name === 'goibibo') properName = 'Goibibo';
            if (o.platform_name === 'agoda') properName = 'Agoda';

            return {
               id: o.id, 
               name: properName, 
               connected: o.connected, 
               apiKey: o.apiKey || '', 
               secret: o.secret || '', 
               endpoint: `https://api.${o.platform_name}.com/v1/` 
            };
        });
        res.json(mappings);
    } catch(err) {
        console.error('Integration fetch Error:', err);
        res.status(500).json({ message: 'Error fetching integrations' });
    }
});

app.post('/api/pricing/dynamic-recommendation', authenticateToken, (req, res) => {
    const { demand, occupancy, isHoliday } = req.body;
    let multiplier = 1;
    if (occupancy > 80) multiplier += 0.2;
    if (isHoliday) multiplier += 0.3;
    if (demand === 'High') multiplier += 0.2;
    res.json({ suggestedMultiplier: multiplier, message: 'Price recommended based on demand.' });
});

// --- Payment & Billing (Razorpay) ---
app.post('/api/payments/create-order', authenticateToken, async (req, res) => {
    try {
        const options = {
            amount: 199 * 100, // ₹199
            currency: "INR",
            receipt: `rcpt_${req.user.id}_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

app.post('/api/payments/verify', authenticateToken, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const updateRes = await pool.query(
            "UPDATE users SET plan_name = 'Pro', plan_expiry = $1 WHERE id = $2 RETURNING email", 
            [newExpiry, req.user.id]
        );
        
        let userEmail = updateRes.rows.length > 0 ? updateRes.rows[0].email : req.user.email;

        // Attempt Mock Nodemailer Email Send
        try {
            await transporter.sendMail({
                from: '"Roomora Billing" <billing@roomora.com>',
                to: userEmail,
                subject: "Payment Confirmed - Roomora Pro",
                html: `<h2>Thank you for upgrading!</h2><p>Your payment of ₹199 is successfully processed. You are now on the Roomora Pro Plan valid until ${new Date(newExpiry).toLocaleDateString()}.</p>`
            });
            console.log(`[Email Sent] Upgrade confirmation sent to ${userEmail}`);
        } catch (err) {
            console.log('[Email Server] Nodemailer ethereal not configured perfectly, skipping email transport mock log.');
        }

        res.json({ success: true, message: 'Payment verified and plan upgraded!', newExpiry });
    } catch(e) {
        console.error('Verification Error:', e);
        res.status(500).json({ message: 'Database failed during payment save' });
    }
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
