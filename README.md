# 🏨 Roomora - Multi-Tenant Hotel Channel Manager & Billing System

<div align="center">
  <img src="https://via.placeholder.com/1000x300.png?text=Roomora+-+Hotel+Management+Made+Simple++&bg=011627&text_color=ffffff" alt="Roomora Banner">
</div>
<br/>

**Roomora** is a fully-fledged, production-ready SaaS application designed exclusively for hotel owners. It acts as a centralized dashboard to track real-time bookings, intelligently update dynamic pricing, analyze revenue KPIs natively, and handle seamless cross-channel syncing to OTAs (Booking.com, Agoda, MakeMyTrip, and Goibibo). 

The platform is strictly multi-tenant isolated, providing enterprise-grade security alongside an optimized, blazing-fast React interface natively optimized for the Indian market.

---

## ✨ Core Features

* **🔐 Complete Authentication Pipeline:** Secure JWT-based session handling, Bcrypt hashed passwords, and robust Multi-Tenant PostgreSQL isolation guaranteeing hotel data privacy.
* **💳 Subscription Billing (Razorpay):** Fully deployed native Razorpay integration explicitly for checking out the ₹199/month *Roomora Pro* package. Also maps automatic e-mail receipts using Nodemailer workflows.
* **📅 Adaptive Calendar & Pricing:** Smart Holiday Calendar tracking intelligently maps dynamic pricing multiplier logics depending on occupancy demand matrices and standard room base prices.
* **🎛 Selective OTA Intercepting:** Multi-platform checkboxes to natively trigger individual or mass syncing updates to Booking.com, Agoda, MMT, and Goibibo simultaneously.
* **📈 Audit Logs & Security Trails:** Deeply tracks user interactions, mapping every single "Price Updated" click to an exact timestamp, specific user_id, and platform matrix to maintain foolproof auditing via natively stored logging.
* **🌙 UI/UX Aesthetics:** Highly responsive design using Tailwind CSS with beautiful dark mode toggles, native Lucide icons, customizable user avatars, and Recharts KPI data visualization.
* **🔔 Smart Event Warnings:** Built-in expiration monitors that explicitly drop a high-visibility red banner to warn the hotel manager if their subscription expires within exactly 7 days.

---

## 🛠️ Technology Stack

**Frontend:**
- **React.js** (Vite Bootstrapped)
- **Tailwind CSS** (for highly responsive utility-first styling)
- **Lucide React** (Consistent modern icon packs)
- **Recharts** (Complex KPI visual graphs)
- **Axios** (Robust API interceptors seamlessly catching 401s for UX)

**Backend:**
- **Node.js + Express.js**
- **PostgreSQL** (Complete native Relational Schema design stored in `init.sql`)
- **Razorpay SDK** (Native checkout order and server verification logic)
- **Nodemailer** (Automated transactional SMTP integrations)
- **Bcrypt.js + JSONWebToken** (Stateless authentication mappings)

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/roomora-channel-manager.git
cd roomora-channel-manager
```

### 2. Configure Backend Server
The server stores internal logic natively connecting mock-in-memory states or standard DB layers.
```bash
cd backend
npm install

# (Optional) If running real Postgres, execute the schema design first:
# psql -U postgres -d roomoradb -f db/init.sql

npm start
# Server listens automatically on http://localhost:5001
```

### 3. Configure Frontend Client
```bash
cd ../frontend
npm install
npm run dev
# Vite runs hot-reload automatically on http://localhost:5173
```

---

## 🔐 Environment Variables

For live production pipelines, map the `.env` internally in the `/backend` folder.

```env
PORT=5001
JWT_SECRET=super_secret_production_key_123
RAZORPAY_KEY_ID=rzp_test_mockkey123
RAZORPAY_SECRET=mocksecret123
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=mock@ethereal.email
SMTP_PASS=mock123
```

---

## 🔌 API Documentation (Key Highlights)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers a new manager, isolates Hotel ID, gives 30-day Free Trial. |
| `POST` | `/api/auth/login` | Validates Bcrypt hashes and issues localized JWT. |
| `GET` | `/api/dashboard/analytics` | Highly isolated pipeline fetching all Bookings mapped to `user.hotel_id`. |
| `POST` | `/api/pricing/update` | Records the `updated_by` trace, pushing prices to select OTAs. |
| `POST` | `/api/payments/create-order` | Initiates the backend Razorpay secure payment instance for checkout. |
| `POST` | `/api/payments/verify` | Confirms signature, unlocks **Roomora Pro**, fires Email trigger. |

---

## 🧪 Testing Credentials
If you skip creating an account, you can quickly test native functionality out of the box using:
- **Username:** `admin`
- **Password:** `password`

*(Requires booting with `mockUsers` empty array so it forces the fallback instance route mapping)*

---

### License
This project is for demonstration and architectural SaaS capability logic. Open-sourced under the **MIT License**.
