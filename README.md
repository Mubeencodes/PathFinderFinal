Fullstack Project (frontend + backend)

Folders:
 - backend: Node.js + Express + MongoDB backend. See backend/README.md for details.
 - frontend: React + Vite frontend. Runs on port 3000.

Quick start:

1. Backend:
   - cd backend
   - copy .env.example to .env and set MONGO_URI and JWT_SECRET
   - npm install
   - npm run seed  # optional to create demo user demo@example.com / demo123
   - npm run dev   # or npm start

2. Frontend:
   - cd frontend
   - npm install
   - npm run dev

Open http://localhost:3000 (frontend). Backend API is at http://localhost:5000/api