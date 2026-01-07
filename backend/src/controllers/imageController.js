const { Image } = require('../models');

class ImageController {
  /**
   * Récupérer toutes les images
   */
  async getAllImages() {
    return await Image.findAll();
  }

  /**
   * Récupérer une image par ID
   */
  async getImageById(id) {
    const image = await Image.findByPk(id);
    
    if (!image) {
      throw new Error('Image non trouvée');
    }
    
    return image;
  }

  /**
   * Créer une nouvelle image
   */
  async createImage({ userId, imagePath }) {
    return await Image.create({ 
      user_id: userId, 
      image_path: imagePath 
    });
  }

  /**
   * Récupérer les images d'un utilisateur
   */
  async getImagesByUserId(userId) {
    return await Image.findAll({ 
      where: { user_id: userId } 
    });
  }
}

module.exports = new ImageController();
