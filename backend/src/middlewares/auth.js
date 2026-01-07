const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_a_changer';

// Middleware pour GraphQL
const authMiddleware = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { user: decoded };
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    return { user: null };
  }
};


module.exports = authMiddleware;
