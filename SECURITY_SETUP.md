# Pyschosomatic Admin Dashboard - Security Setup

## 🔒 Authentication System

Your dashboard now has a secure authentication system with:
- **AES-256 Encryption** for storing tokens
- **SHA-256 Password Hashing**
- **Token-based Authentication** with 24-hour expiry
- **Encrypted localStorage** for session management

## 📝 Firebase Database Setup

You need to add admin credentials to your Firebase Realtime Database:

### Step 1: Set Admin Credentials in Firebase

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project "Pyschosomatic"
3. Go to **Realtime Database**
4. Click on the **Data** tab
5. Add a new node called `admin` with the following structure:

```json
{
  "admin": {
    "username": "admin",
    "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
  }
}
```

**Note:** The password hash above is for: `password` 
⚠️ **CHANGE THIS IMMEDIATELY for security!**

### Step 2: Generate Your Own Password Hash

To generate a secure password hash, run this in your browser console (F12):

```javascript
// Replace 'YourSecurePassword' with your actual password
const password = 'YourSecurePassword';
const hash = require('crypto').createHash('sha256').update(password).digest('hex');
console.log('Your password hash:', hash);
```

Or use this Node.js script:

```javascript
const crypto = require('crypto');
const password = 'YourSecurePassword'; // Change this
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log('Password hash:', hash);
```

### Step 3: Update Firebase Database Rules (IMPORTANT!)

Update your Firebase Realtime Database Rules to protect admin credentials:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    },
    "admin": {
      ".read": true,
      ".write": false
    }
  }
}
```

This ensures:
- ✅ Game can write player data to `/users`
- ✅ Dashboard can read player data from `/users`
- ✅ Dashboard can read admin credentials from `/admin`
- ❌ Nobody can modify admin credentials through the database directly

## 🎯 Default Login Credentials

**Username:** `admin`  
**Password:** `password`

⚠️ **CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

## 🔐 Security Features

1. **Encrypted Session Storage**: Tokens are encrypted using AES-256 before storing in localStorage
2. **Password Hashing**: Passwords are hashed using SHA-256
3. **Token Expiry**: Sessions automatically expire after 24 hours
4. **Secure Authentication Flow**: 
   - User enters credentials
   - Password is hashed client-side
   - Hash compared with Firebase stored hash
   - Encrypted token generated and stored
   - Token validated on each page load

## 🛡️ Production Security Recommendations

1. **Move SECRET_KEY to Environment Variables**:
   - Create `.env` file in root directory
   - Add: `REACT_APP_SECRET_KEY=your-super-secret-key-here`
   - Update `encryption.js` to use: `process.env.REACT_APP_SECRET_KEY`

2. **Use Firebase Admin SDK** for backend authentication instead of client-side

3. **Implement HTTPS** for production deployment

4. **Add Rate Limiting** to prevent brute force attacks

5. **Enable Firebase Authentication** for more robust security

## 🚀 How It Works

```
User Login Flow:
1. User enters username + password
2. Password hashed (SHA-256)
3. Compare hash with Firebase admin/password
4. Generate session token with timestamp
5. Encrypt token (AES-256) 
6. Store in localStorage
7. Token validated on each request (24hr expiry)
```

## 📱 Using the Dashboard

1. Navigate to `http://localhost:3000`
2. You'll see the login page
3. Enter admin credentials
4. Access the secure dashboard
5. Session persists for 24 hours
6. Logout button clears session

## 🔄 Updating Admin Password

1. Generate new password hash (Step 2 above)
2. Update Firebase Database at `admin/password`
3. Old sessions will remain valid until expiry
