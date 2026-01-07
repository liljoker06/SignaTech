const userController = require('../../../controllers/userController');

const userResolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Non authentifié');
      }
      return await userController.getUserById(context.user.userId);
    },
    users: async () => await userController.getAllUsers(),
    user: async (_, { id }) => await userController.getUserById(id),
  },

  Mutation: {
    signup: async (_, args) => await userController.signup(args),
    login: async (_, args) => await userController.login(args),
    createUser: async (_, args) => await userController.createUser(args),
  }
};

module.exports = userResolvers;
