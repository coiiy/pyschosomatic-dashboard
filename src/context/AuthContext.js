import React, { createContext, useState, useContext, useEffect } from 'react';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { encryptData, decryptData, hashPassword } from '../utils/encryption';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Check if user is already authenticated (stored in localStorage with encryption)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const encryptedToken = localStorage.getItem('admin_token');
        const encryptedUser = localStorage.getItem('admin_user');
        
        if (encryptedToken && encryptedUser) {
          const token = decryptData(encryptedToken);
          const user = decryptData(encryptedUser);
          
          // Verify token hasn't expired (24 hour validity)
          const tokenData = JSON.parse(token);
          const now = Date.now();
          const tokenAge = now - tokenData.timestamp;
          const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
          
          if (tokenAge < TWENTY_FOUR_HOURS) {
            setIsAuthenticated(true);
            setAdminUser(user);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // Fetch admin credentials from Firebase
      const adminRef = ref(database, 'admin');
      const snapshot = await get(adminRef);
      
      if (!snapshot.exists()) {
        throw new Error('Admin configuration not found');
      }

      const adminData = snapshot.val();
      const hashedPassword = hashPassword(password);
      
      // Verify credentials
      if (adminData.username === username && adminData.password === hashedPassword) {
        // Generate session token
        const tokenData = {
          username,
          timestamp: Date.now(),
          sessionId: Math.random().toString(36).substring(2)
        };
        
        // Encrypt and store token
        const encryptedToken = encryptData(JSON.stringify(tokenData));
        const encryptedUser = encryptData(username);
        
        localStorage.setItem('admin_token', encryptedToken);
        localStorage.setItem('admin_user', encryptedUser);
        
        setIsAuthenticated(true);
        setAdminUser(username);
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    adminUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
