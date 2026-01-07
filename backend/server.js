const app = require('./src/app');
const setupGraphQL = require('./src/graphql/server');
const { sequelize } = require('./src/config/database');

const PORT = 4000;

const start = async () => {
  try {
    await sequelize.authenticate();    
    await sequelize.sync({ alter: false });
  } catch (error) {
    process.exit(1);
  }

  await setupGraphQL(app);

  app.listen(PORT, () => {
    console.log(`serveur sur http://localhost:${PORT}/graphql`);
  });
};

start().catch(console.error);
