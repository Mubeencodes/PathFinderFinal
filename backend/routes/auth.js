const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// Helper to map supabase user row to user object returned to client
function mapUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    fullname: row.fullname || '',
    bio: row.bio || ''
  };
}

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    console.log('📩 Incoming /register request:', req.body);
    const { username, email, password, fullname, bio } = req.body;
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ msg: 'Please provide username, email and password' });
    }

    // Check existing user by email or username in Supabase
    const { data: existingByEmail, error: errEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    const { data: existingByUsername, error: errUsername } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if ((existingByEmail && existingByEmail.length) || (existingByUsername && existingByUsername.length)) {
      console.log('⚠️ User already exists');
      return res.status(400).json({ msg: 'User with that email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert into Supabase - Fixed column name from passwordHash to password_hash
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash: passwordHash, // Fixed: use snake_case to match database schema
        fullname: fullname || '',
        bio: bio || ''
      }])
      .select()
      .single();

    if (error || !data) {
      console.error('💥 Supabase insert error:', error);
      return res.status(500).json({ msg: 'Error saving user', error: error?.message });
    }

    console.log('✅ User saved to Supabase:', data.email);

    const payload = { user: { id: data.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });

    res.json({ token, user: mapUser(data) });
  } catch (err) {
    console.error('💥 Error in /register:', err);
    res.status(500).send('Server error');
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    console.log('📩 Incoming /login request:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('❌ Missing login fields');
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('💥 Supabase select error:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    const user = users && users[0];
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Fixed: use snake_case column name
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('✅ Login successful for:', email);

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });

    res.json({ token, user: mapUser(user) });
  } catch (err) {
    console.error('💥 Error in /login:', err);
    res.status(500).send('Server error');
  }
});

// GET /api/profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('📩 Incoming /profile request for user ID:', req.user.id);
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .limit(1);

    if (error) {
      console.error('💥 Supabase select error:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    const user = users && users[0];
    if (!user) {
      console.log('❌ Profile not found for user ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('✅ Profile fetched:', user.email);
    res.json(mapUser(user));
  } catch (err) {
    console.error('💥 Error in /profile:', err);
    res.status(500).send('Server error');
  }
});

// PUT /api/profile
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('📩 Incoming /profile update for user ID:', req.user.id, 'with data:', req.body);

    const { fullname, bio } = req.body;

    const updates = {};
    if (typeof fullname === 'string') updates.fullname = fullname;
    if (typeof bio === 'string') updates.bio = bio;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('💥 Supabase update error:', error);
      return res.status(500).json({ msg: 'Server error' });
    }

    console.log('✅ Profile updated:', data.email);
    res.json({ msg: 'Profile updated', user: mapUser(data) });
  } catch (err) {
    console.error('💥 Error in /profile update:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;