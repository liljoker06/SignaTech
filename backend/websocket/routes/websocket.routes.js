const WebSocket = require('ws');
const createScalaSession = require('../scalaClient');

module.exports = function initWebSocketRoutes(server) {
  console.log('[WS] initWebSocketRoutes CALLED');

  const wss = new WebSocket.Server({
    server,
    path: '/ws/translate',
  });

  wss.on('connection', (clientWS) => {
    console.log('[Node] RN client connected');
    createScalaSession(clientWS);
  });
};
