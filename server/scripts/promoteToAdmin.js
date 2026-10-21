require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const promoteToAdmin = async (username) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username });

    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.role = 'ADMIN';
    await user.save();

    console.log(`User ${username} has been promoted to ADMIN`);
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const username = process.argv[2];

if (!username) {
  console.log('Usage: node promoteToAdmin.js <username>');
  process.exit(1);
}

promoteToAdmin(username);
