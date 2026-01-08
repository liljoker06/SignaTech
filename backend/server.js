const app = require('./src/app');
const setupGraphQL = require('./src/routes/graphql/server');
const { sequelize } = require('./src/config/database');

const PORT = 4000;

const start = async () => {
  try {
    console.log('Tentative de connexion à la base de données...');
    await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.'); 
    await sequelize.sync({ alter: false });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
    process.exit(1);
  }

  await setupGraphQL(app);

  app.listen(PORT, () => {
    console.log(`serveur sur http://localhost:${PORT}/graphql`);
  });
};

start().catch(console.error);
