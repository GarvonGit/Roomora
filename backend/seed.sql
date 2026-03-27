-- =========================
-- STEP 1: FIX ENUMS
-- =========================
DO $$
BEGIN
    -- platform_type
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'booking'
        AND enumtypid = 'platform_type'::regtype
    ) THEN
        ALTER TYPE platform_type ADD VALUE 'booking';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'airbnb'
        AND enumtypid = 'platform_type'::regtype
    ) THEN
        ALTER TYPE platform_type ADD VALUE 'airbnb';
    END IF;

    -- booking_status
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'confirmed'
        AND enumtypid = 'booking_status'::regtype
    ) THEN
        ALTER TYPE booking_status ADD VALUE 'confirmed';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'pending'
        AND enumtypid = 'booking_status'::regtype
    ) THEN
        ALTER TYPE booking_status ADD VALUE 'pending';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'cancelled'
        AND enumtypid = 'booking_status'::regtype
    ) THEN
        ALTER TYPE booking_status ADD VALUE 'cancelled';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'completed'
        AND enumtypid = 'booking_status'::regtype
    ) THEN
        ALTER TYPE booking_status ADD VALUE 'completed';
    END IF;
END$$;

COMMIT;


-- =========================
-- STEP 2: INSERT DATA
-- =========================
BEGIN;

-- 👤 USER
INSERT INTO users (
    id,
    username,
    email,
    password_hash,
    phone_number,
    plan_name,
    plan_expiry
)
VALUES (
    101,
    'kunalshah',
    'kunal.shah@gmail.com',
    'hashed_password_123',
    '9876543210',
    'pro',
    NOW() + INTERVAL '30 days'
);

-- 🏨 HOTEL
INSERT INTO hotels (
    id,
    user_id,
    hotel_name,
    created_at
)
VALUES (
    201,
    101,
    'Ocean Crest Boutique Hotel',
    NOW()
);

-- 🛏 ROOMS
INSERT INTO rooms (
    id,
    hotel_id,
    room_type,
    price,
    inventory_count,
    created_at
)
VALUES
(301, 201, 'Deluxe Room', 5000, 12, NOW()),
(302, 201, 'Executive Suite', 9000, 6, NOW()),
(303, 201, 'Sea View Premium', 7500, 8, NOW());

-- 🌐 OTA INTEGRATIONS
INSERT INTO ota_integrations (
    hotel_id,
    platform_id,
    platform_name,
    api_key,
    secret_key
)
VALUES
(201, 1, 'booking', 'api_booking_live_001', 'secret_booking_live'),
(201, 2, 'airbnb', 'api_airbnb_live_002', 'secret_airbnb_live');

-- 📅 INVENTORY
INSERT INTO room_inventory (
    room_id,
    date,
    available_count
)
SELECT r.id, CURRENT_DATE + i, r.inventory_count
FROM rooms r, generate_series(0, 6) AS i
WHERE r.hotel_id = 201;

-- 💰 PRICING
INSERT INTO room_prices (
    room_id,
    date,
    price
)
SELECT r.id, CURRENT_DATE + i,
       r.price + (CASE WHEN i IN (4,5) THEN 1000 ELSE 0 END)
FROM rooms r, generate_series(0, 6) AS i
WHERE r.hotel_id = 201;

-- 📦 BOOKINGS (FINAL FIX WITH PRICE)
INSERT INTO bookings (
    hotel_id,
    platform_id,
    platform_name,
    guest_name,
    room_type,
    price,
    external_booking_id,
    check_in,
    check_out,
    status,
    created_at
)
VALUES
(201, 1, 'booking', 'Rahul Sharma', 'Deluxe Room', 5000, 'BKNG-900001', '2026-04-01', '2026-04-03', 'confirmed', NOW()),
(201, 2, 'airbnb', 'Amit Patel', 'Executive Suite', 9000, 'AIR-900002', '2026-04-02', '2026-04-05', 'confirmed', NOW()),
(201, 1, 'booking', 'Neha Verma', 'Sea View Premium', 7500, 'BKNG-900003', '2026-04-03', '2026-04-04', 'completed', NOW()),
(201, 2, 'airbnb', 'Priya Shah', 'Deluxe Room', 5000, 'AIR-900004', '2026-04-04', '2026-04-06', 'pending', NOW()),
(201, 1, 'booking', 'Vikas Mehta', 'Executive Suite', 9000, 'BKNG-900005', '2026-04-05', '2026-04-07', 'confirmed', NOW()),
(201, 2, 'airbnb', 'Sneha Joshi', 'Sea View Premium', 7500, 'AIR-900006', '2026-04-06', '2026-04-08', 'confirmed', NOW()),
(201, 1, 'booking', 'Arjun Kapoor', 'Deluxe Room', 5000, 'BKNG-900007', '2026-04-07', '2026-04-09', 'cancelled', NOW()),
(201, 2, 'airbnb', 'Karan Malhotra', 'Executive Suite', 9000, 'AIR-900008', '2026-04-08', '2026-04-10', 'confirmed', NOW()),
(201, 1, 'booking', 'Pooja Singh', 'Sea View Premium', 7500, 'BKNG-900009', '2026-04-09', '2026-04-11', 'completed', NOW()),
(201, 2, 'airbnb', 'Rohit Jain', 'Deluxe Room', 5000, 'AIR-900010', '2026-04-10', '2026-04-12', 'confirmed', NOW());

COMMIT;
