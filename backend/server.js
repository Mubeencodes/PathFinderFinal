require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase'); // ✅ use Supabase instead of MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', require('./routes/auth'));

app.get('/', (req, res) => res.send({ ok: true, message: 'Backend is running' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
