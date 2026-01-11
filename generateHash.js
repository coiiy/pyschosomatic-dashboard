// Quick script to generate password hash for Firebase admin setup
// Run this with: node generateHash.js

const crypto = require('crypto');

// CHANGE THIS PASSWORD to your desired admin password
const password = 'password';

// Generate SHA-256 hash
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n=================================');
console.log('🔐 PASSWORD HASH GENERATOR');
console.log('=================================\n');
console.log('Password:', password);
console.log('SHA-256 Hash:', hash);
console.log('\n=================================');
console.log('📋 FIREBASE DATABASE SETUP');
console.log('=================================\n');
console.log('Add this to your Firebase Realtime Database:\n');
console.log(JSON.stringify({
  admin: {
    username: 'admin',
    password: hash
  }
}, null, 2));
console.log('\n=================================\n');
