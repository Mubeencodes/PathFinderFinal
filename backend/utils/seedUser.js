// Seed a demo user. Run: node utils/seedUser.js (ensure MONGO_URI set)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

(async function(){
  try {
    await mongoose.connect(uri);
    const email = 'demo@example.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Demo user already exists');
      process.exit(0);
    }
    const passwordHash = await bcrypt.hash('demo123', 10);
    const user = new User({ username: 'demo', email, passwordHash, fullname: 'Demo User', bio: 'Seeded demo user' });
    await user.save();
    console.log('Demo user created: demo@example.com / demo123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();