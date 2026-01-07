const imageController = require('../../../controllers/imageController');

const imageResolvers = {
  Query: {
    images: async () => await imageController.getAllImages(),
    image: async (_, { id }) => await imageController.getImageById(id),
  },

  Mutation: {
    createImage: async (_, args) => await imageController.createImage(args),
  }
};

module.exports = imageResolvers;
