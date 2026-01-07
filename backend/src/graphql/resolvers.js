const userService = require('../services/userService');
const imageService = require('../services/imageService');
const modelService = require('../services/modelService');
const classService = require('../services/classService');
const predictionService = require('../services/predictionService');
const schoolService = require('../services/schoolService');

const resolvers = {
  Query: { // query = GET 
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Non authentifié');
      }
      return await userService.getUserById(context.user.userId);
    },
    users: async () => await userService.getAllUsers(),
    user: async (_, { id }) => await userService.getUserById(id),
    images: async () => await imageService.getAllImages(),
    image: async (_, { id }) => await imageService.getImageById(id),
    models: async () => await modelService.getAllModels(),
    model: async (_, { id }) => await modelService.getModelById(id),
    classes: async () => await classService.getAllClasses(),
    class: async (_, { id }) => await classService.getClassById(id),
    predictions: async () => await predictionService.getAllPredictions(),
    prediction: async (_, { id }) => await predictionService.getPredictionById(id),
    schools: async () => await schoolService.getAllSchools(),
    school: async (_, { id }) => await schoolService.getSchoolById(id),
  },

  Mutation: { // mutation = POST, PUT, DELETE
    signup: async (_, args) => await userService.signup(args),
    login: async (_, args) => await userService.login(args),
    createUser: async (_, args) => await userService.createUser(args),
    createImage: async (_, args) => await imageService.createImage(args),
    createModel: async (_, args) => await modelService.createModel(args),
    createClass: async (_, args) => await classService.createClass(args),
    createPrediction: async (_, args) => await predictionService.createPrediction(args),
    createSchool: async (_, args) => await schoolService.createSchool(args),
  }
};

module.exports = resolvers;
