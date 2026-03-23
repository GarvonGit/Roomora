const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

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

// ==========================================
// 💡 MOCK POSTGRESQL MULTI-TENANT DATABASE
// ==========================================
let mockUsers = []; 
let mockHotels = [{ id: 1, user_id: 0, hotel_name: 'Grand Plaza Hotel' }];

let mockBookings = [
    { id: 1, hotel_id: 1, guest_name: "Rahul Sharma", room_type: "Standard Room", check_in: "2026-04-01", check_out: "2026-04-05", ota_source: "Booking.com", price: 6000, status: "Confirmed" },
    { id: 2, hotel_id: 1, guest_name: "Anita Desai", room_type: "Deluxe Room", check_in: "2026-04-02", check_out: "2026-04-04", ota_source: "Agoda", price: 5000, status: "Confirmed" },
    { id: 3, hotel_id: 1, guest_name: "Vikram Singh", room_type: "Suite", check_in: "2026-04-10", check_out: "2026-04-12", ota_source: "MakeMyTrip", price: 10000, status: "Pending" },
    { id: 4, hotel_id: 1, guest_name: "Pooja Patel", room_type: "Standard Room", check_in: "2026-04-15", check_out: "2026-04-18", ota_source: "Goibibo", price: 4500, status: "Cancelled" }
];

let mockInventory = [
    { id: 1, hotel_id: 1, type: "Standard Room", total_count: 20, available: 15, base_price: 1500 },
    { id: 2, hotel_id: 1, type: "Deluxe Room", total_count: 10, available: 8, base_price: 2500 },
    { id: 3, hotel_id: 1, type: "Suite", total_count: 5, available: 5, base_price: 5000 }
];

let mockIntegrations = [
    { id: 1, hotel_id: 1, name: 'Booking.com', connected: true, apiKey: 'bkg_live_8f7d9a8c7b6a', secret: 'sec_9x8c7v6b5n4m', endpoint: 'https://api.booking.com/v1/' },
    { id: 2, hotel_id: 1, name: 'Agoda', connected: true, apiKey: 'agd_live_2b3c4d5e6f7g', secret: 'sec_1a2s3d4f5g6h', endpoint: 'https://api.agoda.com/v2/' },
    { id: 3, hotel_id: 1, name: 'MakeMyTrip', connected: false, apiKey: '', secret: '', endpoint: 'https://api.makemytrip.com/hts/' },
    { id: 4, hotel_id: 1, name: 'Goibibo', connected: false, apiKey: '', secret: '', endpoint: 'https://api.goibibo.com/v1/' }
];

let priceHistoryLogs = [];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        
        // Find user's hotel automatically mapping to database relations
        const userHotel = mockHotels.find(h => h.user_id === user.id);
        req.user.hotel_id = userHotel ? userHotel.id : null;
        
        next();
    });
};

// --- Auth ---
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, hotelName, phoneNumber, password } = req.body;
    
    if (!username || !email || !hotelName || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (mockUsers.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ message: 'Username or Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserId = mockUsers.length + 1;
    const newHotelId = mockHotels.length + 1;

    // Free plan default upon signup
    const newUser = { 
        id: newUserId, 
        username, 
        email, 
        phoneNumber, 
        password_hash: hashedPassword, 
        role: 'Admin', 
        plan_name: 'Free',
        plan_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days trial
    };
    mockUsers.push(newUser);

    // Securely tie the hotel strictly to this new user (SaaS Logic)
    mockHotels.push({ id: newHotelId, user_id: newUserId, hotel_name: hotelName });

    // Seed empty default integrations for this hotel
    ['Booking.com', 'Agoda', 'MakeMyTrip', 'Goibibo'].forEach((name, i) => {
        mockIntegrations.push({ id: mockIntegrations.length + 1, hotel_id: newHotelId, name, connected: false, apiKey: '', secret: '', endpoint: `https://api.${name.toLowerCase()}.com/` });
    });

    // Seed dummy empty inventory for this new logged-in user
    mockInventory.push({ id: mockInventory.length + 1, hotel_id: newHotelId, type: "Standard Room", total_count: 10, available: 10, base_price: 1000 });

    const token = jwt.sign({ id: newUser.id, username: newUser.username, hotelName }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { username: newUser.username, hotelName, role: newUser.role } });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Default test fallback mappings matching user_id = 0
    if (username === 'admin' && password === 'password' && mockUsers.length === 0) {
        const token = jwt.sign({ id: 0, username: 'admin', email: 'admin@roomora.com', hotelName: 'Grand Plaza Hotel' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { id: 0, username: 'admin', email: 'admin@roomora.com', hotelName: 'Grand Plaza Hotel', role: 'Admin', plan_name: 'Pro', plan_expiry: new Date(Date.now() + 5*24*60*60*1000).toISOString() } });
    }

    const user = mockUsers.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const hotel = mockHotels.find(h => h.user_id === user.id);
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, hotelName: hotel?.hotel_name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, hotelName: hotel?.hotel_name, role: user.role, plan_name: user.plan_name, plan_expiry: user.plan_expiry } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// --- Dashboard Analytics ---
app.get('/api/dashboard/analytics', authenticateToken, (req, res) => {
    // Isolated Analytics data specifically fetched for req.user.hotel_id
    const userBookings = mockBookings.filter(b => b.hotel_id === req.user.hotel_id);
    
    res.json({
        kpis: {
            totalBookings: userBookings.length,
            revenue: userBookings.reduce((sum, b) => sum + b.price, 0),
            occupancyRate: userBookings.length > 0 ? 85 : 0,
            activeChannels: mockIntegrations.filter(i => i.hotel_id === req.user.hotel_id && i.connected).length
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
            { name: 'Booking.com', value: userBookings.filter(b=>b.ota_source==='Booking.com').length },
            { name: 'Agoda', value: userBookings.filter(b=>b.ota_source==='Agoda').length },
            { name: 'MakeMyTrip', value: userBookings.filter(b=>b.ota_source==='MakeMyTrip').length },
            { name: 'Goibibo', value: userBookings.filter(b=>b.ota_source==='Goibibo').length }
        ] : []
    });
});

// --- Inventory ---
app.get('/api/inventory', authenticateToken, (req, res) => {
    // Only fetch Rooms belonging to specific Hotel Account
    res.json(mockInventory.filter(i => i.hotel_id === req.user.hotel_id));
});

app.post('/api/inventory/sync-all', authenticateToken, async (req, res) => {
    // Simulate sync
    await new Promise(r => setTimeout(r, 1500));
    res.json({ success: true, message: 'Successfully synced all channels for this user' });
});

// Scope Selective Price Update Tracking
app.post('/api/pricing/update', authenticateToken, async (req, res) => {
    const { roomId, newPrice, platforms } = req.body;
    
    // Validate Room explicitly belongs to the logged in user
    const room = mockInventory.find(r => r.id === roomId && r.hotel_id === req.user.hotel_id);
    if (!room) return res.status(404).json({ message: 'Room not found or Unauthorized' });
    
    const oldPrice = room.base_price;
    room.base_price = newPrice; 

    // Mapped strictly to the logged-in specific user
    const logEntry = {
        id: priceHistoryLogs.length + 1,
        hotel_id: req.user.hotel_id,
        room_id: roomId,
        old_price: oldPrice,
        new_price: newPrice,
        platforms_updated: platforms.join(", "),
        changed_by: req.user.username,
        updated_by_id: req.user.id,
        timestamp: new Date().toISOString()
    };
    priceHistoryLogs.push(logEntry);

    res.json({ 
        success: true, 
        message: 'Price updated successfully on selected platforms',
        // Show only logs mapped to this hotel account
        logs: priceHistoryLogs.filter(log => log.hotel_id === req.user.hotel_id)
    });
});

// --- Bookings ---
app.get('/api/bookings', authenticateToken, (req, res) => {
    // Only dispatch Bookings referencing this hotel ownership
    res.json(mockBookings.filter(b => b.hotel_id === req.user.hotel_id));
});

// --- Settings/Integration UI Mock ---
app.get('/api/integrations', authenticateToken, (req, res) => {
    // Load solely the API Keys generated explicitly for this User's hotel
    res.json(mockIntegrations.filter(i => i.hotel_id === req.user.hotel_id));
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
    
    // In actual production, verify razorpay_signature using crypto module.
    // For now we mock successful payment update:

    const userIndex = mockUsers.findIndex(u => u.id === req.user.id);
    
    let userEmail = 'admin@roomora.com';
    let newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    if (userIndex !== -1) {
        mockUsers[userIndex].plan_name = 'Pro';
        mockUsers[userIndex].plan_expiry = newExpiry;
        userEmail = mockUsers[userIndex].email;
    }

    // Attempt Mock Nodemailer Email Send
    try {
        await transporter.sendMail({
            from: '"Roomora Billing" <billing@roomora.com>',
            to: userEmail,
            subject: "Payment Confirmed - Roomora Pro",
            html: `<h2>Thank you for upgrading!</h2><p>Your payment of ₹199 is successfully processed. You are now on the Roomora Pro Plan valid until ${new Date(newExpiry).toLocaleDateString()}.</p>`
        });
        console.log(`[Email Sent] Upgrade confirmation sent to ${userEmail}`);
    } catch(err) {
        console.log('[Email Server] Nodemailer ethereal not configured perfectly, skipping email transport mock log.');
    }

    res.json({ success: true, message: 'Payment verified and plan upgraded!', newExpiry });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
