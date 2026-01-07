const schoolController = require('../../../controllers/schoolController');

const schoolResolvers = {
  Query: {
    schools: async () => await schoolController.getAllSchools(),
    school: async (_, { id }) => await schoolController.getSchoolById(id),
  },

  Mutation: {
    createSchool: async (_, args) => await schoolController.createSchool(args),
  }
};

module.exports = schoolResolvers;
