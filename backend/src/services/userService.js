const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_a_changer';

class UserService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async signup({ username, email, password, birthDate }) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      birth_date: birthDate
    });

    const token = this.generateToken(user);

    return { token, user };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user);

    return { token, user };
  }

  /**
   * Récupérer tous les utilisateurs
   */
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    return user;
  }

  /**
   * Créer un utilisateur (sans authentification)
   */
  async createUser({ username, email, password }) {
    return await User.create({ 
      username, 
      email, 
      password_hash: password 
    });
  }

  /**
   * Générer un token JWT
   */
  generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  /**
   * Vérifier un token JWT
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }
}

module.exports = new UserService();
