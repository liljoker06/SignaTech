const classController = require('../../../controllers/classController');

const classResolvers = {
  Query: {
    classes: async () => await classController.getAllClasses(),
    class: async (_, { id }) => await classController.getClassById(id),
  },

  Mutation: {
    createClass: async (_, args) => await classController.createClass(args),
  }
};

module.exports = classResolvers;
