# TaskFlow ⚡

A high-performance, full-stack Task Management web application designed for the MERN Stack Internship Assignment. Handcrafted with a premium glassmorphic dark theme, secure authentication, real-time productivity metrics, and robust data management.

---

## 🌟 Key Highlights & Bonus Criteria Achieved

To demonstrate technical capability and creativity, the following advanced features were implemented in addition to the core assignment scope:

### 1. Interactive Data Visualization (Creative Bonus) 📊
- Implemented **Recharts** charts within the user Profile tab.
- Includes a responsive, interactive **Donut Chart** that dynamically updates segment dimensions to visually represent the ratio of **Completed** tasks vs. **Pending** tasks with micro-animation tooltips on hover.

### 2. Smart Due-Date & Precision AM/PM Scheduler ⏰
- Tasks support exact target times using a hybrid date picker and a dedicated **AM/PM time selector** (e.g. `2:30 PM`).
- Displayed dates are parsed and formatted into localized strings.
- Overdue indicators assess deadlines in real-time, down to the precise hour and minute.

### 3. Core & Advanced Search, Filtering, and Pagination 🔍
- **Fuzzy Search**: Filter tasks by title or description in real-time.
- **Multi-dimensional Filters**: Quickly toggle tasks by Status (`All`, `Pending`, `Completed`, `Overdue`) or Time Horizon (`All`, `Today`, `Upcoming`).
- **Server-Side Pagination**: Implemented complete cursor-based pagination (page numbers, items-per-page, and disabled states) to guarantee scalability for large volumes of user data.

### 4. Enterprise-Grade Security Enhancements 🔒
- **Session Hygiene**: Session-based token storage (`sessionStorage`) instead of persistent `localStorage` to ensure authentication tokens clear on window/tab closure.
- **Secure Profile Editing**: Users can change their name, email, or password directly within the Profile tab. To prevent unauthorized alterations, password and email updates require verifying the user's **current password** in the database.
- **Protected Routes**: Custom frontend and backend route guards prevent unauthorized endpoint access and auto-redirect unauthenticated requests.

### 5. Premium UI/UX & Micro-Animations 🎨
- Formulated a unique dark glassmorphism design system using custom CSS variables (no templates/cookie-cutter UI frameworks).
- Subtle gradients, custom loading spinners, micro-hover transformations, and real-time custom notification alerts (powered by `react-hot-toast`).
- Complete responsive support across mobile, tablet, and widescreen viewports.
- **Custom 404 Route**: A styled fallback page routing invalid URLs back to the application dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology | Key Packages |
|---|---|---|
| **Frontend** | React 18, Vite | `react-router-dom`, `recharts`, `lucide-react`, `react-hot-toast`, `axios` |
| **Backend** | Node.js, Express.js | `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv` |
| **Database** | MongoDB | `mongoose` |
| **Styling** | Vanilla CSS3 | Custom typography, fluid grid, glassmorphic filters, keyframe animations |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18.0.0 or higher)
- MongoDB (local community instance or MongoDB Atlas URI)

### 1. Clone & Navigate
```bash
git clone https://github.com/rayyanqureshi0123/TaskFlow.git
cd TaskFlow
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=your_jwt_super_secret_signing_key_here
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The server will boot on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd client
   npm install
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will boot on `http://localhost:5173`.*

---

## 📂 Project Structure

```text
TaskFlow/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/         # App logo/visual resources
│   │   ├── components/     # Modals, Protection guards, Task elements
│   │   ├── context/        # Global Authentication State Provider
│   │   ├── pages/          # Login, Register, Dashboard, NotFound
│   │   ├── services/       # Axios API wrapper clients
│   │   ├── App.jsx         # Router config & toast container
│   │   ├── index.css       # Design system token stylesheet
│   │   └── main.jsx        # App entrypoint
│   └── ...
└── server/                 # Express Backend API
    ├── config/             # DB client connector 
    ├── controllers/        # Route handler methods (Auth, Tasks)
    ├── middleware/         # Protected route auth token parsing
    ├── models/             # Mongoose schemas (User, Task)
    ├── routes/             # RESTful API routing endpoints
    └── server.js           # Server application configuration
```

---

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Create a new user account.
- `POST /api/auth/login` — Authenticate credentials and return JWT.
- `GET /api/auth/me` — Retrieve session context for active user (Protected).
- `PUT /api/auth/profile` — Update user credentials/password (Protected).

### Task Endpoints (All Protected)
- `GET /api/tasks` — Retrieve paginated tasks (supports `page`, `limit`, query strings `search`, `status`, and `date`).
- `POST /api/tasks` — Create a task (title, description, status, due date, due time, AM/PM).
- `PUT /api/tasks/:id` — Update existing task parameters.
- `PATCH /api/tasks/:id/toggle` — Instantly switch task status between Pending and Completed.
- `DELETE /api/tasks/:id` — Hard delete a task.

---

## 🤝 Evaluation Criteria Alignment

- **Secure Login & Registration**: Fully functional. Enforces password hashing using `bcryptjs` and token validation via JWT middleware.
- **Full CRUD operations**: Done. Accessible from a unified interface with task creation modal controls.
- **Status toggles**: Complete. Updates the database and triggers local component reactivity instantly.
- **Form validation**: Complete. Frontend fields perform format validation, displaying dynamic error labels under input fields, and handle backend server errors gracefully.
- **Clean UI & Code organization**: Code is logically split by concerns into middleware, routers, controllers, and pages.

---

## 📄 License
This project is licensed under the MIT License.
