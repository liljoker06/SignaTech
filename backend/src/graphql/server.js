const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const cors = require('cors');
const bodyParser = require('body-parser');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const authMiddleware = require('../middlewares/auth');

module.exports = async (app) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    csrfPrevention: false,
    introspection: true,
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => authMiddleware(req)
    })
  );
};
