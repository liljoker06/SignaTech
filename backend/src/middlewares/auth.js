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

// Middleware pour REST API
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      error: 'Token d\'authentification manquant' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token invalide ou expiré' 
    });
  }
};

module.exports = authMiddleware;
module.exports.verifyToken = verifyToken;
