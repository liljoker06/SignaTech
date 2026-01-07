const userService = require('../services/userService');

// Inscription
exports.signup = async (req, res) => {
  try {
    const { username, email, password, birthDate } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis' 
      });
    }

    const result = await userService.signup({ username, email, password, birthDate });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      ...result
    });
  } catch (error) {
    console.error('Erreur signup:', error);
    res.status(error.message.includes('existe déjà') ? 409 : 500).json({ 
      error: error.message || 'Erreur lors de la création de l\'utilisateur' 
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email et mot de passe requis' 
      });
    }

    const result = await userService.login({ email, password });

    res.json({
      message: 'Connexion réussie',
      ...result
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(401).json({ 
      error: error.message || 'Erreur lors de la connexion' 
    });
  }
};

// recup le profil
exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.userId);

    res.json({ user });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(404).json({ 
      error: error.message || 'Erreur lors de la récupération du profil' 
    });
  }
};
