let socket = null;

export const connect = (url, handlers) => {
  if (socket) return;

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('[TranslateWS] Connected');
    handlers?.onOpen?.();
  };

  socket.onmessage = handlers?.onMessage;
  socket.onerror = handlers?.onError;

  socket.onclose = () => {
    console.log('[TranslateWS] Closed');
    socket = null;
    handlers?.onClose?.();
  };
};

export const disconnect = () => {
  console.log('[WS] disconnect() CALLED');
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const isConnected = () =>
  socket && socket.readyState === WebSocket.OPEN;

export const send = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  }
};
