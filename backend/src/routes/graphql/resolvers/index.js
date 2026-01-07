const userResolvers = require('./userResolvers');
const schoolResolvers = require('./schoolResolvers');
const imageResolvers = require('./imageResolvers');
const modelResolvers = require('./modelResolvers');
const classResolvers = require('./classResolvers');
const predictionResolvers = require('./predictionResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...schoolResolvers.Query,
    ...imageResolvers.Query,
    ...modelResolvers.Query,
    ...classResolvers.Query,
    ...predictionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...schoolResolvers.Mutation,
    ...imageResolvers.Mutation,
    ...modelResolvers.Mutation,
    ...classResolvers.Mutation,
    ...predictionResolvers.Mutation,
  }
};

module.exports = resolvers;
