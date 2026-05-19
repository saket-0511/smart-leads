# 🚀 SmartLeads — Full Stack Lead Management Dashboard

A production-ready Lead Management System built with the **MERN stack + TypeScript**.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Zustand |
| Backend   | Node.js, Express.js, TypeScript         |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT + bcrypt                            |
| DevOps    | Docker + Docker Compose                 |

---

## Features

- 🔐 **JWT Authentication** — Register, login, protected routes
- 👥 **Role-Based Access Control** — Admin vs Sales User permissions
- 📋 **Lead CRUD** — Create, view, update, delete leads
- 🔍 **Advanced Filtering** — Filter by status, source, search by name/email, sort
- ⚡ **Debounced Search** — 400ms debounce to minimize API calls
- 📄 **Backend Pagination** — 10 records/page with full metadata
- 📥 **CSV Export** — Download all leads as CSV
- 🌙 **Dark Mode** — Toggleable dark/light theme
- 📱 **Responsive UI** — Works on all screen sizes
- ✅ **Form Validation** — Client + server side
- 🐳 **Docker Ready** — Full containerised setup

---

## Project Structure

```
smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/       # ProtectedRoute
│   │   │   ├── layout/     # Sidebar + Layout wrapper
│   │   │   ├── leads/      # LeadTable, LeadForm, LeadFilters
│   │   │   └── ui/         # Badge, Loading, Modal, Pagination
│   │   ├── hooks/          # useDebounce, useLeads
│   │   ├── pages/          # Login, Register, Dashboard, Leads
│   │   ├── services/       # API calls (authService, leadsService)
│   │   ├── store/          # Zustand auth store
│   │   └── types/          # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
│
├── docker-compose.yml
├── API_DOCS.md
└── README.md
```

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd smart-leads

# Start everything with Docker
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

---

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+
- MongoDB running locally

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET

# Run in development
npm run dev
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run in development
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Overview

Full documentation in [`API_DOCS.md`](./API_DOCS.md).

| Method | Endpoint             | Auth | Description            |
|--------|----------------------|------|------------------------|
| POST   | /auth/register       | ❌   | Register user          |
| POST   | /auth/login          | ❌   | Login                  |
| GET    | /auth/me             | ✅   | Get current user       |
| GET    | /leads               | ✅   | List leads (filtered)  |
| POST   | /leads               | ✅   | Create lead            |
| GET    | /leads/:id           | ✅   | Get single lead        |
| PUT    | /leads/:id           | ✅   | Update lead            |
| DELETE | /leads/:id           | ✅ Admin | Delete lead        |
| GET    | /leads/export/csv    | ✅   | Export as CSV          |

---

## Role Permissions

| Feature          | Admin | Sales |
|------------------|-------|-------|
| View all leads   | ✅    | Own only |
| Create lead      | ✅    | ✅    |
| Update lead      | ✅    | Own only |
| Delete lead      | ✅    | ❌    |
| Export CSV       | ✅    | ✅ (own) |

---

## Submission

Send to: **ritik.yadav@servicehive.tech**
Subject: `MERN Internship Assignment Submission - Your Name`
