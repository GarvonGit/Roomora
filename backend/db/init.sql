-- Clean up existing tables and types if re-running
DROP TABLE IF EXISTS price_update_logs CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS ota_integrations CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS platform_type CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;

-- 1. Create Custom ENUM Types
CREATE TYPE platform_type AS ENUM ('booking', 'agoda', 'makemytrip', 'goibibo');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'pending');

-- 2. Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    plan_name VARCHAR(50) DEFAULT 'Pro',
    plan_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Hotels Table (SaaS Scalable)
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hotels_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create OTA_Integrations Table
CREATE TABLE ota_integrations (
    id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    platform_name platform_type NOT NULL,
    api_key VARCHAR(255),
    secret_key VARCHAR(255),
    is_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ota_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    UNIQUE(hotel_id, platform_name) -- A hotel should only have one configuration per platform
);

-- 5. Create Rooms Table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    inventory_count INT NOT NULL CHECK (inventory_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rooms_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- 6. Create Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    platform_name platform_type NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    status booking_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    CONSTRAINT chk_dates CHECK (check_out > check_in)
);

-- 7. Create Price_Update_Logs Table
CREATE TABLE price_update_logs (
    id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    updated_by INT, -- Tracks the specific user who changed this price
    platform_name platform_type NOT NULL,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    CONSTRAINT fk_log_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_log_user_id FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Create Indexes for Performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_hotels_user_id ON hotels(user_id);
CREATE INDEX idx_ota_platform ON ota_integrations(platform_name);
CREATE INDEX idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX idx_bookings_platform ON bookings(platform_name);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_logs_hotel_id ON price_update_logs(hotel_id);

-- ==========================================
-- 💡 SAMPLE DATA AND QUERIES BELOW
-- ==========================================

-- A. Insert Test Users
INSERT INTO users (username, email, password_hash, phone_number, plan_name, plan_expiry) 
VALUES 
    ('admin', 'admin@roomora.com', '$2a$10$7s/L/pIq7zPZ2g3F2Kx3...ExampleHash', '+91 9876543210', 'Pro', CURRENT_TIMESTAMP + INTERVAL '30 days'),
    ('manager2', 'manager@roomora.com', '$2a$10$xyz123abc456def789...ExampleHash', '+91 8765432109', 'Pro', CURRENT_TIMESTAMP + INTERVAL '5 days');

-- B. Insert Test Hotels
INSERT INTO hotels (user_id, hotel_name) 
VALUES 
    (1, 'Grand Plaza Hotel'),
    (2, 'Oceanview Resort');

-- C. Insert OTA Integrations
INSERT INTO ota_integrations (hotel_id, platform_name, api_key, secret_key, is_connected) 
VALUES 
    (1, 'booking', 'bkg_live_abc123', 'sec_xyz789', true),
    (1, 'agoda', 'agd_live_def456', 'sec_uvw123', true),
    (1, 'makemytrip', NULL, NULL, false),
    (1, 'goibibo', NULL, NULL, false);

-- D. Insert Room Inventory
INSERT INTO rooms (hotel_id, room_type, price, inventory_count) 
VALUES 
    (1, 'Standard Room', 1500.00, 20),
    (1, 'Deluxe Room', 2500.00, 10),
    (1, 'Presidential Suite', 10000.00, 2);

-- E. Insert Mock Bookings
INSERT INTO bookings (hotel_id, platform_name, guest_name, room_type, check_in, check_out, price, status) 
VALUES 
    (1, 'booking', 'Rahul Sharma', 'Deluxe Room', '2026-04-10', '2026-04-15', 12500.00, 'confirmed'),
    (1, 'agoda', 'Anita Desai', 'Standard Room', '2026-04-12', '2026-04-14', 3000.00, 'confirmed'),
    (1, 'makemytrip', 'Vikram Singh', 'Presidential Suite', '2026-05-01', '2026-05-03', 20000.00, 'pending');

-- F. Insert Price Update Logs
INSERT INTO price_update_logs (hotel_id, room_id, updated_by, platform_name, old_price, new_price) 
VALUES 
    (1, 1, 1, 'booking', 1400.00, 1500.00),
    (1, 2, 2, 'agoda', 2300.00, 2500.00);

-- ==========================================
-- 🔎 EXAMPLE SELECT QUERIES
-- ==========================================

/* 
1. Get all bookings for a specific hotel 
SELECT * FROM bookings 
WHERE hotel_id = 1 
ORDER BY check_in DESC;

2. Get bookings filtered by platform 
SELECT guest_name, room_type, check_in, check_out, price, status 
FROM bookings 
WHERE hotel_id = 1 AND platform_name = 'booking';

3. Get room inventory for a specific hotel
SELECT room_type, inventory_count, price 
FROM rooms 
WHERE hotel_id = 1;

4. Calculate Total Revenue by Platform for a Hotel
SELECT platform_name, SUM(price) as total_revenue
FROM bookings
WHERE hotel_id = 1 AND status = 'confirmed'
GROUP BY platform_name;
*/
