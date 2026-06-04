# TaskFlow

A full-stack task management web application built with React, Express, and MongoDB. Organize, track, and manage your daily tasks with secure JWT authentication.

## Features

- **User Authentication** — Register & login with JWT-based sessions
- **Full CRUD** — Create, read, update, and delete tasks
- **Status Toggle** — One-click toggle between Pending and Completed
- **Search & Filter** — Find tasks by keyword and filter by status
- **Pagination** — Clean paginated task list
- **Due Dates** — Optional due date with overdue indicators
- **Responsive** — Works on mobile, tablet, and desktop
- **Toast Notifications** — Real-time feedback for all actions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios, Lucide Icons |
| Backend | Node.js, Express, JWT, bcryptjs |
| Database | MongoDB, Mongoose |
| Styling | Vanilla CSS with custom design tokens |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/rayyanqureshi0123/TaskFlow.git
cd TaskFlow
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key_here
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
TaskFlow/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context provider
│   │   ├── pages/        # Login, Register, Dashboard
│   │   └── services/     # API service layer
│   └── ...
├── server/          # Express backend
│   ├── config/      # Database config
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth middleware
│   ├── models/      # Mongoose schemas
│   └── routes/      # API routes
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (protected)

### Tasks (all protected)
- `GET /api/tasks` — Get all tasks (with search, filter, pagination)
- `POST /api/tasks` — Create task
- `PUT /api/tasks/:id` — Update task
- `PATCH /api/tasks/:id/toggle` — Toggle task status
- `DELETE /api/tasks/:id` — Delete task

## License

MIT
