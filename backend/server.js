const app = require('./src/app');
const setupGraphQL = require('./src/graphql/server');

const PORT = 4000;

const start = async () => {
  await setupGraphQL(app);

  app.listen(PORT, () => {
    console.log(`serveur sur http://localhost:${PORT}/graphql`);
  });
};

start().catch(console.error);
