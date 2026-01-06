const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { sequelize } = require('./config/database');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    graphql: '/graphql',
    api: '/api'
  });
});

app.use('/api/auth', authRoutes);

const startServer = async () => {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    csrfPrevention: false,
    introspection: true,
  });
  await server.start();

  app.use(
    '/graphql',
    cors(),
    expressMiddleware(server)
  );

  await sequelize.authenticate();
  console.log('Connexion PostgreSQL OK');
  
  await sequelize.sync();
  console.log('Tables vérifiées/créées');

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}/graphql`);
  });
};

startServer().catch(console.error);

module.exports = app;