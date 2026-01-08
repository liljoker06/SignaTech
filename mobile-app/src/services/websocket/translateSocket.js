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
      const data = JSON.parse(event.data);
      if (data.type === 'translation') {
        onTranslation(data.payload);
      }
    },
    onClose: () => console.log('[TranslateWS] Closed'),
    onError: (e) => console.log('[TranslateWS] Error', e),
  });
};

export const stopTranslation = () => {
  ws.disconnect();
};
