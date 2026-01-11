import CryptoJS from 'crypto-js';

// Secret key for AES encryption - Store this securely in production (env variable)
const SECRET_KEY = 'PYSCHOSOMATIC_ADMIN_SECRET_KEY_2026';

/**
 * Encrypt data using AES encryption
 * @param {string} data - Data to encrypt
 * @returns {string} Encrypted data
 */
export const encryptData = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES decryption
 * @param {string} encryptedData - Encrypted data
 * @returns {string} Decrypted data
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Generate a secure token for authentication
 * @param {string} username - Username
 * @param {string} timestamp - Current timestamp
 * @returns {string} Generated token
 */
export const generateToken = (username, timestamp) => {
  const data = `${username}:${timestamp}:${SECRET_KEY}`;
  return CryptoJS.SHA256(data).toString();
};

/**
 * Verify if a token is valid
 * @param {string} token - Token to verify
 * @param {string} username - Username
 * @param {string} timestamp - Timestamp
 * @returns {boolean} Is token valid
 */
export const verifyToken = (token, username, timestamp) => {
  const expectedToken = generateToken(username, timestamp);
  return token === expectedToken;
};

/**
 * Hash password using SHA256
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};
