const http = require('http');

const app = require('./src/app');
const setupGraphQL = require('./src/routes/graphql/server');
const { sequelize } = require('./src/config/database');
const initWebSocketRoutes = require('./websocket/routes/websocket.routes');

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';

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

  const server = http.createServer(app);

  server.listen(PORT, HOST, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
    console.log(`GraphQL disponible sur http://localhost:${PORT}/graphql`);

    // 🔄 WebSocket attaché au serveur HTTP
    initWebSocketRoutes(server);
  });
};

start().catch(console.error);
