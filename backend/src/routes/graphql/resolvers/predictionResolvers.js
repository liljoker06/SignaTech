const predictionController = require('../../../controllers/predictionController');

const predictionResolvers = {
  Query: {
    predictions: async () => await predictionController.getAllPredictions(),
    prediction: async (_, { id }) => await predictionController.getPredictionById(id),
  },

  Mutation: {
    createPrediction: async (_, args) => await predictionController.createPrediction(args),
  }
};

module.exports = predictionResolvers;
