const { Model } = require('../models');

class ModelService {
  /**
   * Récupérer tous les modèles
   */
  async getAllModels() {
    return await Model.findAll();
  }

  /**
   * Récupérer un modèle par ID
   */
  async getModelById(id) {
    const model = await Model.findByPk(id);
    
    if (!model) {
      throw new Error('Modèle non trouvé');
    }
    
    return model;
  }

  /**
   * Créer un nouveau modèle
   */
  async createModel({ name, version }) {
    return await Model.create({ name, version });
  }
}

module.exports = new ModelService();
