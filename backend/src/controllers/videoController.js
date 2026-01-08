const { Video } = require("../models");

class VideoController {

  async getAllVideo() {
    return await Video.findAll();
  }

  async getVideoById(id) {
    return await Video.findByPk(id);
  }

  async createVideo({ url, titre }) {
    const [video] = await Video.findOrCreate({
      where: { titre },
      defaults: { url }
    });

    return video;
  }
}

module.exports = new VideoController();
