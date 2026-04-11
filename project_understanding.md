# Roomora - Comprehensive Project Architecture & Flow

Roomora is a comprehensive Software-as-a-Service (SaaS) platform built for hotel owners in India. It acts as a unified hub allowing hoteliers to manage their physical room inventory, process and view online bookings, simulate integrations with real-world Online Travel Agencies (OTAs), and employ rule-based dynamic pricing to maximize profits during peak demand.

Below is a detailed breakdown of the exact files, data flows, user journeys, and future technical roadmap.

---

## 1. File-by-File Breakdown

### 📁 Frontend (`/frontend`)
Built via **Vite + React** and styled extensively using **Tailwind CSS**.

#### Entry & Layouts
*   **`src/main.jsx`**: Bootstraps the React DOM and mounts the application.
*   **`src/App.jsx`**: The core router file. Responsible for mapping URL routes to specific page components. Contains the `PrivateRoute` logic (currently running bypassed for immediate local testing) and dark/light mode state management.
*   **`src/layouts/DashboardLayout.jsx`**: The structural shell applied to all authenticated pages. Features the persistent side navigation (Dashboard, Inventory, Bookings, Calendar, Settings), the top-level user account header, and mock notification dropdowns.

#### Pages (The Core UI Views)
*   **`src/pages/LandingPage.jsx`**: The unauthenticated entry page designed to convert visitors. High-fidelity UI with marketing copy outlining Roomora's features.
*   **`src/pages/Login.jsx` & `Signup.jsx`**: Authentication pages. Captures user identity, hotel name, and handles the initial onboarding handshake with the server.
*   **`src/pages/Dashboard.jsx`**: The main analytics landing point. Utilizes **Recharts** to plot monthly revenue lines and pie charts breaking down which OTAs are generating the most bookings. Connects to `/api/dashboard/analytics`.
*   **`src/pages/Inventory.jsx`**: A real-time grid view of rooms. Shows total vs actual available units (`total_count` vs `available`). Connects to `/api/inventory`.
*   **`src/pages/Bookings.jsx`**: A tabular ledger tracking historical and upcoming guest stays. Filters include guest name, check-in dates, and the OTA platform used. Connects to `/api/bookings`.
*   **`src/pages/Calendar.jsx`**: The complex pricing engine view. 
    *   *Role:* Renders a monthly calendar grid. 
    *   *Rules:* Calculates daily multipliers using local arrays (like `initialIndianHolidays`). Weekends inherently add +25%, holidays add +40%. Custom events statically add +35%. 
    *   *Features:* Hover/Click states reveal color-coded impacts on the base price across various room types.
*   **`src/pages/Settings.jsx`**: Form inputs for user profile updates. Also serves as the Hub for OTA Channel Management, listing integrations (Agoda, Airbnb, MakeMyTrip) and allowing mock-syncing toggles.
*   **`src/pages/Analytics.jsx`**: A dedicated deep-dive view for strict numerical reporting and forecasting beyond the dashboard's quick perspective.

#### Utilities & Components
*   **`src/utils/api.js`**: An Axios configuration instance that ensures base API URLs are prepended, and authentication Bearer tokens are attached to local storage for persistent sessions.
*   **`src/components/GlobalLoader.jsx`**: Spinner animation used during route transitions or heavy HTTP fetching.

---

### 📁 Backend (`/backend`)
A monolithic **Node.js + Express.js** server. Originally intended to run with Supabase PostgreSQL, it is currently running an elaborate **In-Memory SQL Mocker** to bypass cloud dependencies entirely.

*   **`server.js`**: The heart of the backend.
    *   **In-Memory Database (`const pool`)**: Intercepts native raw SQL queries like `SELECT * FROM bookings` and returns structurally accurate mocked array data. Dynamically generates data to simulate a live traffic environment (e.g. 15 randomized real-time bookings a day). 
    *   **Auth Bypass**: Intercepts tokens inside `authenticateToken` middleware and immediately assigns `req.user` to ID 101 to allow frictionless testing.
    *   **Auth Routes (`/api/auth/...`)**: Endpoints for signing up and exchanging passwords for JWTs safely using `bcryptjs`.
    *   **API Endpoints (`/api/dashboard`, `/api/inventory`, `/api/bookings`)**: Routes parsing the mocked SQL response pools. For instance, the dashboard endpoint maps total days against randomized mock bookings to generate historical trending lines.
    *   **Webhook Interface (`/api/inventory/webhook-sync`)**: A specialized pseudo-endpoint designed to act as if real OTAs check-in to lower local inventory automatically.
    *   **Payments (`/api/payments`)**: A mock Razorpay bridge integration that signals a successful SaaS plan update (from Free to Pro) over an Ethereal SMTP email stub.

---

## 2. User & Data Flow Architecture

### **Flow 1: User Onboarding & Auth**
1. User lands on `/` (Landing Page).
2. Navigates to `/signup` or `/login`. 
3. *Data Flow*: Form submits `username/password` `POST /api/auth/login`. 
4. *Backend*: Verifies via mock database, spins up a JWT. 
5. *Client*: Saves JWT in `localStorage` securely and redirects flow into `/dashboard`.

### **Flow 2: Dashboard Analytics Rendering**
1. User enters `/dashboard`.
2. *Data Flow*: `useEffect` fires `GET /api/dashboard/analytics`.
3. *Backend*: Intercepts SQL, uses a `for` loop to build ~40 randomized bookings covering major OTAs natively on the backend, calculates the sum, groups them functionally by Month/Day, and returns a sanitized JSON array.
4. *Frontend*: Ingests JSON, mapping "Month/Revenue" variables directly into `<LineChart />` from Recharts.

### **Flow 3: Adding a Custom Local Event (Calendar)**
1. User clicks "Add Custom Event" in `/calendar`.
2. Input captured (e.g., "Cricket Match" on "April 15th").
3. *Data Flow*: Handled entirely locally now natively within React state. It bypasses backend HTTP posts since AI engines were scrubbed.
4. *Response*: A new object map forces the day object of the 15th to register a 1.35x base price multiplier. UI redraws to highlight the 15th in green profit margins.

---

## 3. Future Technical Plan & Roadmap

As the project scales from a proof-of-concept into a production-ready system, specific transitional efforts need to be achieved:

### **Phase 1: Real Database Implementation**
*   **Remove SQL Mocker**: Deprecate the massive `const pool` mock object inside `server.js`. 
*   **Supabase/Neon Connection**: Wire real PostgreSQL credentials using `pg` or an ORM like `Prisma` / `Drizzle`.
*   **Seed Real Migrations**: Ensure `users`, `hotels`, `rooms`, `bookings`, `ota_integrations` tables are strictly typed and seeded for remote environments.

### **Phase 2: Proper Authentication & Security**
*   **Deprecate Bypass**: Reactivate the strict `jwt.verify()` logic currently commented out in `server.js`.
*   **Zod / Joi Validation**: Implement strict input validation on all generic `req.body` parameters at the Express level to prevent SQL injection and malformed requests.

### **Phase 3: Live OTA Webhook Handling (Channel Management)**
*   **Genuine OAuth & Webhooks**: Switch the mock `/webhook-sync` tools over to proper REST API protocols with Booking.com and Airbnb.
*   **Concurrency Locks**: Since simultaneous bookings from different OTAs can lead to overselling, PostgreSQL transactional locks (`SELECT FOR UPDATE`) must be implemented on the `rooms/inventory` table.

### **Phase 4: Multi-tenancy Isolation**
*   **Row Level Security (RLS)**: Enforce strict backend rules to ensure Hotel Owner A (ID 101) can never run a GET request that natively returns the analytics strings belonging to Hotel Owner B.

### **Phase 5: Production Deployment Strategy**
*   **Vite Optimization**: Utilize code-splitting (`React.lazy()`) in `App.jsx` to ensure lightweight JavaScript bundles.
*   **Vercel & Railway**: The frontend should be natively deployed on Vercel while the Express monolith operates best on a continuous container instance (like Render or Railway) for reliable socket/CRON task handling.
