const videoController = require('../../../controllers/videoController');

const videoResolvers = {
  Query: {
    videos: async () => await videoController.getAllVideo(),
    video: async (_, { id }) => await videoController.getVideoById(id),
  },

  Mutation: {
    createVideo: async (_, args) => await videoController.createVideo(args),
  }
};

module.exports = videoResolvers;