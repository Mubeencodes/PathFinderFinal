# Node + Express + Supabase Backend

This backend provides a simple authentication API for a React frontend:

- POST /api/register
- POST /api/login
- GET /api/profile (Authorization: Bearer <token>)
- PUT /api/profile (Authorization: Bearer <token>)

## Quick start

1. Copy `.env.example` to `.env` and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `JWT_SECRET` .
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed a demo user (optional):
   ```bash
   npm run seed
   ```
4. Start server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

The server runs on `http://localhost:5000` by default.
