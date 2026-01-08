const { Video } = require("../models");

class VideoController {
  /**
   * Récupérer toutes les vidéos
   */
  async getAllVideo() {
    return await Video.findAll();
  }

  /**
   * Récupérer une vidéo par ID
   */
  async getVideoById(id) {
    const video = await Video.findByPk(id);
    return video;
  }

  /**
   * Créer une vidéo
   */
  async createVideo({ url, titre }) {
    return await Video.create({ url, titre });
  }
}

module.exports = new VideoController();
