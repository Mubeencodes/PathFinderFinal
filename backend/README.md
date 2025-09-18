# Node + Express + MongoDB Backend (Auth with JWT)

This backend provides a simple authentication API for a React frontend:
- POST /api/register
- POST /api/login
- GET /api/profile (Authorization: Bearer <token>)
- PUT /api/profile (Authorization: Bearer <token>)

## Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
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

## Notes for the frontend (React)
- After login/register, the server responds with `{ token, user }`.
- Save `token` in memory or localStorage and send in `Authorization` header:
  `Authorization: Bearer <token>`
- Example fetch to get profile:
  ```js
  fetch('http://localhost:5000/api/profile', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  ```

## Security notes
- Change `JWT_SECRET` before deploying.
- Consider refresh tokens or server-side session invalidation for production.\n\nNOTE: Backend was migrated to use Supabase. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.\n