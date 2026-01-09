import * as ws from './wsService';

const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

export const startTranslation = (onTranslation) => {
  if (!WS_URL) {
    console.error('[TranslateWS] WS_URL not defined');
    return;
  }

  ws.connect(WS_URL, {
    onOpen: () => console.log('[TranslateWS] Connected'),
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        onTranslation(data);
      } catch (e) {
        console.error('[TranslateWS] Parse error:', e);
      }
    },
    onClose: () => console.log('[TranslateWS] Closed'),
    onError: (e) => console.log('[TranslateWS] Error', e),
  });
};

export const stopTranslation = () => {
  ws.disconnect();
};

export const sendFrame = (base64Image) => {
  if (!ws.isConnected()) {
    console.warn('[TranslateWS] Not connected, cannot send frame');
    return;
  }
  
  console.log('[TranslateWS] 📤 Envoi frame (longueur base64:', base64Image.length, ')');
  
  ws.send(JSON.stringify({
    type: 'frame',
    data: base64Image,
  }));
  
  console.log('[TranslateWS] ✅ Frame envoyée');
};
