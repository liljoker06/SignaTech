const { Class } = require('../models');

class ClassController {
  /**
   * Récupérer toutes les classes
   */
  async getAllClasses() {
    return await Class.findAll();
  }

  /**
   * Récupérer une classe par ID
   */
  async getClassById(id) {
    const classItem = await Class.findByPk(id);
    
    if (!classItem) {
      throw new Error('Classe non trouvée');
    }
    
    return classItem;
  }

  /**
   * Créer une nouvelle classe
   */
  async createClass({ label, description }) {
    return await Class.create({ label, description });
  }
}

module.exports = new ClassController();
