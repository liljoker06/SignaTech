const userResolvers = require('./userResolvers');
const schoolResolvers = require('./schoolResolvers');
const schoolLevelResolvers = require('./schoolLevelResolvers');
const imageResolvers = require('./imageResolvers');
const modelResolvers = require('./modelResolvers');
const classResolvers = require('./classResolvers');
const predictionResolvers = require('./predictionResolvers');
const videoResolvers = require('./videoResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...schoolResolvers.Query,
    ...schoolLevelResolvers.Query,
    ...imageResolvers.Query,
    ...modelResolvers.Query,
    ...classResolvers.Query,
    ...predictionResolvers.Query,
    ...videoResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...schoolResolvers.Mutation,
    ...schoolLevelResolvers.Mutation,
    ...imageResolvers.Mutation,
    ...modelResolvers.Mutation,
    ...classResolvers.Mutation,
    ...predictionResolvers.Mutation,
    ...videoResolvers.Mutation,
  }
};

module.exports = resolvers;
