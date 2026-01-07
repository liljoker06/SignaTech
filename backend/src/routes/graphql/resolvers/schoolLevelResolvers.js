const schoolLevelController = require('../../../controllers/schoolLevelController');

const schoolLevelResolvers = {
  Query: {
    schoolLevels: async () => await schoolLevelController.getAllSchoolLevels(),
    schoolLevel: async (_, { id }) => await schoolLevelController.getSchoolLevelById(id),
    schoolLevelsBySchool: async (_, { schoolId }) => await schoolLevelController.getSchoolLevelsBySchoolId(schoolId),
  },

  Mutation: {
    createSchoolLevel: async (_, args) => await schoolLevelController.createSchoolLevel(args),
  }
};

module.exports = schoolLevelResolvers;
