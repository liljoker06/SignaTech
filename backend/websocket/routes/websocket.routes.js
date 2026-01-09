const WebSocket = require('ws');

// WebSocket Services
const PYTHON_WS_URL = 'ws://localhost:8000/ws/translate';
const SCALA_WS_URL = 'ws://localhost:8080/ws/filter';

module.exports = function initWebSocketRoutes(server) {
  console.log('[WS] initWebSocketRoutes CALLED');

  const wss = new WebSocket.Server({
    server,
    path: '/ws/translate',
  });

  wss.on('connection', (clientWS) => {
    console.log('[Node] Mobile client connected');
    
    let pythonWS = null;
    let scalaWS = null;
    let reconnectTimeout = null;
    
    // Connexion au service Python
    const connectToPython = () => {
      pythonWS = new WebSocket(PYTHON_WS_URL);
      
      pythonWS.on('open', () => {
        console.log('[Node→Python] Connected');
      });
      
      pythonWS.on('message', (data) => {
        // Recevoir la prédiction du Python et l'envoyer à Scala pour filtrage
        console.log('[Node←Python] Prediction:', data.toString());
        
        if (scalaWS && scalaWS.readyState === WebSocket.OPEN) {
          scalaWS.send(data.toString());
        } else {
          // Si Scala n'est pas connecté, envoyer directement au mobile
          if (clientWS.readyState === WebSocket.OPEN) {
            clientWS.send(data.toString());
          }
        }
      });
      
      pythonWS.on('close', () => {
        console.log('[Node→Python] Disconnected');
        reconnectTimeout = setTimeout(connectToPython, 2000);
      });
      
      pythonWS.on('error', (err) => {
        console.error('[Node→Python] Error:', err.message);
      });
    };
    
    // Connexion au service Scala (optionnel pour filtrage)
    const connectToScala = () => {
      scalaWS = new WebSocket(SCALA_WS_URL);
      
      scalaWS.on('open', () => {
        console.log('[Node→Scala] Connected for filtering');
      });
      
      scalaWS.on('message', (data) => {
        // Recevoir le résultat filtré de Scala et l'envoyer au mobile
        console.log('[Node←Scala] Filtered:', data.toString());
        if (clientWS.readyState === WebSocket.OPEN) {
          clientWS.send(data.toString());
        }
      });
      
      scalaWS.on('close', () => {
        console.log('[Node→Scala] Disconnected (optional service)');
        scalaWS = null;
      });
      
      scalaWS.on('error', (err) => {
        console.warn('[Node→Scala] Not available (optional):', err.message);
        scalaWS = null;
      });
    };
    
    connectToPython();
    connectToScala(); // Optionnel
    
    // Recevoir les frames du mobile et les transmettre au Python
    clientWS.on('message', (data) => {
      if (pythonWS && pythonWS.readyState === WebSocket.OPEN) {
        pythonWS.send(data.toString());
      } else {
        console.warn('[Node] Python not connected, frame dropped');
      }
    });
    
    clientWS.on('close', () => {
      console.log('[Node] Mobile client disconnected');
      if (pythonWS) pythonWS.close();
      if (scalaWS) scalaWS.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    });
    
    clientWS.on('error', (err) => {
      console.error('[Node] Client error:', err.message);
      if (pythonWS) pythonWS.close();
      if (scalaWS) scalaWS.close();
    });
  });
};
