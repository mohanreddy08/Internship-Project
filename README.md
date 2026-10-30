# CampusSync — College Club & Fest Event Management Portal

> A full-stack MERN portal empowering college students to explore fests, hackathons, seminars, and workshops with real-time seat tracking, automated waitlists, verifiable QR-style digital passes, and a dedicated Club Lead Administration Dashboard.

---

## 🌟 Key Features

### 🎓 Student Experience
- **Explore & Filter Events**: Search campus events by title, organizing club, or venue; filter across departments (`CSE`, `ECE`, `EEE`, `IT`, `MECH`, `CIVIL`) and event categories (`Workshop`, `Hackathon`, `Fest`, `Seminar`).
- **Live Capacity & Automated Waitlist**:
  - Real-time visual progress bars showing current registrations vs maximum capacity.
  - If seats are available, instant registration assigns a **CONFIRMED** pass and increments capacity.
  - If seats are full, the system automatically marks the ticket as **WAITLISTED** without exceeding maximum capacity.
- **Verifiable Digital Gate Passes (`/my-passes`)**:
  - Digital passes featuring Event Name, Organizing Club, Date, Venue, Student Name, Roll Number, Status Badge (`CONFIRMED` in green, `WAITLISTED` in amber), and unique Pass ID (`CSYNC-XXXXXX`).
  - Scannable visual QR-code security block for gate entry.
  - **Download / Print Pass**: Dedicated print styling (`@media print`) allowing students to download/print their pass cleanly to PDF.

### 🛡️ Club Lead (Admin) Portal (`/admin`)
- **Event Publishing Modal**: Publish new campus events with title, organizing club, department, category, date, venue, max capacity, and description.
- **Event Management**: Live grid of all events with direct delete capability (removes event and all associated student registrations).
- **Attendance & Verification Roster**: Inspect student roster per event (`Roll Number`, `Name`, `Department`, `Email`, `Status`, `Pass ID`).
- **One-Click CSV Export**: Download attendance rosters directly as `.csv` spreadsheets for club record-keeping and on-ground check-ins.

### ⚡ Quick Demo Evaluation
- Instant one-click demo login buttons directly on the Login page (`/login`) for both **Student** and **Club Lead (Admin)** roles.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Axios, React Router v6.
- **Backend**: Node.js, Express.js, Mongoose ODM, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`.
- **Database**: MongoDB Atlas (with local in-memory fallback for offline/isolated demo evaluation).

---

## 📂 Project Architecture

```
CampusSync/
├── .gitignore                     # Root gitignore (ignores node_modules, .env, build dist)
├── README.md                      # Complete documentation
│
├── server/
│   ├── .env                       # Environment configuration (PORT, MONGO_URI, JWT_SECRET)
│   ├── .gitignore                 # Server gitignore
│   ├── package.json               # Express, Mongoose, JWT, Bcrypt, CORS
│   ├── server.js                  # Express app entry point & route definitions
│   ├── seed.js                    # Database seeder (5 events, 3 users, sample passes)
│   ├── config/
│   │   └── db.js                  # Resilient Mongoose connection handler
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification (protect) & adminOnly guard
│   │   └── capacityMiddleware.js  # Checks capacity & assigns 'confirmed' vs 'waitlisted'
│   ├── models/
│   │   ├── User.js                # Name, email, password, rollNumber, department, role
│   │   ├── Event.js               # Title, clubName, category, date, capacity tracking
│   │   └── Registration.js        # Compound unique index { eventId, userId }, passId, status
│   ├── controllers/
│   │   ├── authController.js      # Register, login, getMe
│   │   ├── eventController.js     # Filterable event queries, create, delete with cascade
│   │   └── registrationController.js # Event registration, my-passes, admin roster export
│   └── routes/
│       ├── authRoutes.js          # /api/auth
│       ├── eventRoutes.js         # /api/events
│       └── registrationRoutes.js  # /api/registrations
│
└── client/
    ├── index.html                 # HTML shell with Google Fonts
    ├── package.json               # React, Vite, Tailwind, Lucide, Axios, React Router
    ├── vite.config.js             # Vite config with /api proxy to localhost:5000
    ├── tailwind.config.js         # Tailwind CSS styling configuration
    ├── postcss.config.js          # PostCSS configuration
    └── src/
        ├── main.jsx               # React DOM root with BrowserRouter & AuthProvider
        ├── App.jsx                # Route structure & protected route wrappers
        ├── index.css              # Tailwind base + @media print styles
        ├── api/
        │   └── axios.js           # Axios instance with JWT Authorization interceptor
        ├── context/
        │   └── AuthContext.jsx    # User session, login, register, logout global state
        ├── components/
        │   ├── Navbar.jsx         # Header with branding, role badge & mobile menu
        │   └── ProtectedRoute.jsx # Route guard for logged-in and admin-only pages
        └── pages/
            ├── Login.jsx          # Login with Quick Demo access buttons
            ├── Register.jsx       # Student & Admin registration form
            ├── ExploreEvents.jsx  # Event hub, search, filters & one-click register
            ├── MyPasses.jsx       # Digital ticket passes & printable gate pass
            └── AdminDashboard.jsx # Club lead portal, event creator & CSV roster exporter
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Backend Setup
1. Open a terminal in the root directory:
   ```bash
   cd server
   npm install
   ```
2. Verify `/server/.env` contains your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://MyDb:MyDbpass@cluster0.igure.mongodb.net/campussync?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=campussync_super_secret_jwt_key_2026
   ```
3. Populate the database with initial users and events:
   ```bash
   node seed.js
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The server runs on `http://localhost:5000`.*

---

### 2. Frontend Setup
1. Open a second terminal window in the root directory:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Roll Number | Notes |
|---|---|---|---|---|
| **Club Lead (Admin)** | `admin@campussync.edu` | `password123` | `ADMIN01` | Access to Admin Portal, create/delete events & export rosters |
| **Student** | `student@campussync.edu` | `password123` | `24CSE101` | Pre-registered for Hackathon; test waitlist on IoT Bootcamp |
| **Student 2** | `priya@campussync.edu` | `password123` | `24ECE205` | Registered for IoT Bootcamp |

> 💡 **Tip**: Click the **"Student Demo"** or **"Admin Demo"** buttons on the login screen to sign in instantly with one click.

---

## 🧪 Testing the Waitlist Logic
1. Log in as **Aarav Sharma** (`student@campussync.edu`).
2. Go to **Explore Events**.
3. Locate **"IoT & Robotics Bootcamp"** (Capacity: 2/2 spots filled).
4. Click **"Full - Join Waitlist"**.
5. Notice your registration is accepted and placed on the waitlist!
6. Navigate to **"My Passes"** to see your pass marked with the amber **WAITLISTED** badge and a unique security Pass ID.
7. Switch to the **Admin Portal** (`admin@campussync.edu`), click **Roster** on "IoT & Robotics Bootcamp", and see both confirmed attendees alongside waitlisted attendees, then click **Export Roster to CSV**!
