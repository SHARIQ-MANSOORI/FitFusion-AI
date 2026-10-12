# FitFusion AI

FitFusion AI is a full-stack MERN application that provides AI-powered fitness solutions. It delivers customized workout and meal plans generated through Google Gemini, an interactive AI fitness coach chat, and progress tracking CRUD functionality, built with clean architecture, strict input validation, and user data isolation.

---

## Features

- **Authentication & Security**: Secure registration and login using bcrypt password hashing (10 salt rounds) and JWT authentication with 7-day expiration. Route protection on frontend and backend, with Helmet, CORS origin restriction, and request rate limiting.
- **AI Workout Plan Generator**: Generates customized weekly workout plans tailored to fitness goal, current weight, height, and experience level.
- **AI Diet Plan Generator**: Creates one-day structured meal plans based on dietary preferences (Vegetarian, Non-Vegetarian, Vegan), calorie targets, and goals.
- **AI Fitness Coach Chat**: Interactive coaching interface restricted strictly to fitness, wellness, and nutrition advice.
- **Progress Tracking (CRUD)**: Log, list, edit, and delete personal weight check-ins and notes, with chronological sorting and per-user data isolation.
- **Safety & Disclaimers**: Integrated guidance reminders that AI-generated output is not medical advice.
- **Responsive Interface**: Minimal, lightweight styling using plain CSS without heavy frameworks, fully responsive down to mobile viewports (375px).

---

## Tech Stack

- **Frontend**:
  - React 19 (functional components and hooks)
  - Vite
  - React Router 7
  - Axios
  - Plain CSS (design tokens, flexible layout, table scrolling)
- **Backend**:
  - Node.js (CommonJS modules)
  - Express 5
  - Mongoose 9 (MongoDB ODM)
  - Zod (schema validation)
  - Helmet & CORS (HTTP header and origin security)
  - express-rate-limit (endpoint rate limiting)
  - bcryptjs & jsonwebtoken (authentication)
  - @google/generative-ai (Google Gemini integration)
- **Testing**:
  - Jest & Supertest
- **Database**:
  - MongoDB (local instance or MongoDB Atlas)

---

## Folder Structure

```
FitnessFusion-AI/
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── app.js
│   ├── package.json
│   ├── server.js
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── authController.js
│   │   │   └── progressController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── error.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── Diet.js
│   │   │   ├── Progress.js
│   │   │   ├── User.js
│   │   │   └── Workout.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── chat.js
│   │   │   ├── diet.js
│   │   │   ├── progress.js
│   │   │   └── workout.js
│   │   └── services/
│   │       └── gemini.js
│   └── tests/
│       ├── auth.test.js
│       └── progress.test.js
└── client/
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── contexts/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Chat.jsx
        │   ├── Dashboard.jsx
        │   ├── Diet.jsx
        │   ├── Login.jsx
        │   ├── Progress.jsx
        │   ├── Register.jsx
        │   └── Workout.jsx
        ├── services/
        │   └── api.js
        └── styles/
            └── index.css
```

---

## Prerequisites

- **Node.js**: v18 or later
- **MongoDB**: Local MongoDB instance (running on port 27017) or MongoDB Atlas cluster
- **Google Gemini API Key**: API key for accessing Google Generative AI models

---

## Step-by-Step Local Setup

### 1. Clone & Setup Backend

Navigate to the `backend/` directory:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` by copying `.env.example`:
```bash
cp .env.example .env
```

Configure the environment variables in `backend/.env`:
- `PORT`: Port for the backend API server (e.g., `5000`)
- `MONGO_URI`: MongoDB connection string for application data (e.g., `mongodb://127.0.0.1:27017/fitfusion_dev`)
- `MONGO_URI_TEST`: **Separate** MongoDB connection string for running automated tests (e.g., `mongodb://127.0.0.1:27017/fitfusion_test`)
- `JWT_SECRET`: Secret key used for signing JWT tokens (min 32 characters recommended)
- `GEMINI_API_KEY`: Google Gemini API key
- `GEMINI_MODEL`: Gemini model identifier (e.g., `gemini-1.5-flash`)
- `CLIENT_URL`: Allowed frontend origin for CORS (e.g., `http://localhost:5173`)

Start the backend server:
```bash
npm run dev
```

### 2. Setup Client

In a separate terminal, navigate to the `client/` directory:
```bash
cd client
npm install
```

Create a `.env` file in `client/` by copying `.env.example`:
```bash
cp .env.example .env
```

Configure the environment variables in `client/.env`:
- `VITE_API_URL`: Base URL of the backend API (e.g., `http://localhost:5000/api`)

Start the Vite development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## Running Tests

Automated backend tests are written using Jest and Supertest.

> **CRITICAL**: The test suite requires the `MONGO_URI_TEST` environment variable and must point to a **separate database**. If `MONGO_URI_TEST` is unset, the tests fail immediately with a clear error message and never fall back to `MONGO_URI`.

Run the test suite from the `backend/` directory:
```bash
cd backend
npm test
```

To set the test database inline:
```bash
# Windows PowerShell
$env:MONGO_URI_TEST="mongodb://127.0.0.1:27017/fitfusion_test"; npm test

# Linux / macOS
MONGO_URI_TEST="mongodb://127.0.0.1:27017/fitfusion_test" npm test
```

---

## API Endpoints

| Method | Route | Auth Required | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new user; returns JWT token and user profile (no password) |
| `POST` | `/api/auth/login` | No | Authenticate user credentials; returns JWT token and user profile |
| `GET` | `/api/auth/me` | Yes | Fetch profile for currently authenticated user |
| `POST` | `/api/workout/generate` | Yes | Generate and persist an AI workout plan |
| `POST` | `/api/diet/generate` | Yes | Generate and persist an AI diet meal plan |
| `POST` | `/api/chat/ask` | Yes | Submit query to AI Fitness Coach and receive advice |
| `GET` | `/api/progress/my` | Yes | Retrieve authenticated user's progress records (newest first) |
| `POST` | `/api/progress/add` | Yes | Create a new weight progress record |
| `PUT` | `/api/progress/:id` | Yes | Update an owned progress record |
| `DELETE` | `/api/progress/:id` | Yes | Delete an owned progress record |
| `GET` | `/api/health` | No | Health check route (`{ status: "ok" }`) |

---

## Troubleshooting

- **MongoDB Connection Error**:
  - Ensure the MongoDB daemon (`mongod`) is running and listening on `127.0.0.1:27017`.
  - Check that the `MONGO_URI` is correctly formatted in `.env`.
- **CORS Errors in Browser**:
  - Verify `CLIENT_URL` in `backend/.env` exactly matches the client origin (e.g., `http://localhost:5173` without trailing slashes).
- **Gemini / AI Failures (502 Bad Gateway)**:
  - Verify that `GEMINI_API_KEY` is valid and active in Google AI Studio.
  - Check that `GEMINI_MODEL` is a supported model name (e.g., `gemini-1.5-flash`).
  - When the AI service is unavailable, the backend returns a clean `502` error (`"AI service unavailable, try again later"`) without crashing the server.
- **401 Redirect Loops**:
  - The client Axios interceptor clears `token` and `user` from `localStorage` and redirects to `/login` when receiving an unauthorized status on protected routes.
  - Verify that `JWT_SECRET` in `backend/.env` is consistent and that client requests carry the `Authorization: Bearer <token>` header.
