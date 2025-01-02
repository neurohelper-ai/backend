const jwt = require('jsonwebtoken');

const payload = {
  email: 'user@example.com',
  // Add other user information if needed
};

const secret = 'your-secret-key'; // Use a secure secret key
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Generated JWT:', token);