const modelController = require('../../../controllers/modelController');

const modelResolvers = {
  Query: {
    models: async () => await modelController.getAllModels(),
    model: async (_, { id }) => await modelController.getModelById(id),
  },

  Mutation: {
    createModel: async (_, args) => await modelController.createModel(args),
  }
};

module.exports = modelResolvers;
