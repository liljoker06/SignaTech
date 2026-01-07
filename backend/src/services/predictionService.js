const { Prediction } = require('../models');

class PredictionService {
  /**
   * Récupérer toutes les prédictions
   */
  async getAllPredictions() {
    return await Prediction.findAll();
  }

  /**
   * Récupérer une prédiction par ID
   */
  async getPredictionById(id) {
    const prediction = await Prediction.findByPk(id);
    
    if (!prediction) {
      throw new Error('Prédiction non trouvée');
    }
    
    return prediction;
  }

  /**
   * Créer une nouvelle prédiction
   */
  async createPrediction({ imageId, modelId, predictedClassId, confidenceScore }) {
    return await Prediction.create({
      image_id: imageId,
      model_id: modelId,
      predicted_class_id: predictedClassId,
      confidence_score: confidenceScore
    });
  }

  /**
   * Récupérer les prédictions d'une image
   */
  async getPredictionsByImageId(imageId) {
    return await Prediction.findAll({ 
      where: { image_id: imageId } 
    });
  }
}

module.exports = new PredictionService();
