# 🔐 Quick Setup Guide

## Step 1: Add Admin to Firebase

Go to your Firebase Console and add this data:

**Path:** `/admin`

```json
{
  "username": "admin",
  "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
}
```

**Default Login Credentials:**
- Username: `admin`
- Password: `password`

## Step 2: Update Firebase Rules

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

## Step 3: Test Login

1. Open `http://localhost:3000`
2. Enter: `admin` / `password`
3. You should see the dashboard!

## Step 4: Change Password

Run `node generateHash.js` with your new password, then update Firebase.

---

## 🎯 What You Get

✅ **Secure Login System**
- AES-256 encryption for tokens
- SHA-256 password hashing  
- 24-hour session expiry
- Protected routes

✅ **Firebase Integration**
- Token-based authentication
- Encrypted session storage
- Admin credentials in database

✅ **User Interface**
- Professional login page
- Logout functionality
- Admin badge showing logged-in user
- Error handling

---

**Need help?** Check [SECURITY_SETUP.md](./SECURITY_SETUP.md) for detailed documentation.
