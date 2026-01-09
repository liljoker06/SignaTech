const WebSocket = require('ws');

const SCALA_WS_URL = 'ws://localhost:8080/ws/translate';

module.exports = function createScalaSession(clientWS) {
  const scalaWS = new WebSocket(SCALA_WS_URL);

  scalaWS.on('open', () => {
    console.log('[Node][Scala] Connected');
  });

  scalaWS.on('message', (data) => {
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.send(data.toString());
    }
  });

  clientWS.on('message', (data) => {
    if (scalaWS.readyState === WebSocket.OPEN) {
      scalaWS.send(data.toString());
    }
  });

  
  clientWS.on('close', () => {
    console.log('[Node] RN client disconnected');
    scalaWS.close();
  });

  scalaWS.on('close', () => {
    console.log('[Node][Scala] Disconnected');
    clientWS.close();
  });

  clientWS.on('error', () => scalaWS.close());
  scalaWS.on('error', () => clientWS.close());
};
