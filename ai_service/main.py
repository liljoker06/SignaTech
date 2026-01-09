# main.py
import torch
from fastapi import FastAPI, WebSocket
from websocket.alphabet_ws import AlphabetWebSocket

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔥 Device Python: {DEVICE}")

app = FastAPI()
ws_manager = AlphabetWebSocket(device=DEVICE)

@app.websocket("/ws/alphabet")
async def alphabet_socket(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()  
            print(f"Message reçu de Scala: {message}")  
            
            await websocket.send_text("Message reçu")
    except Exception as e:
        print(f"Erreur avec WebSocket: {e}")
        ws_manager.disconnect(websocket)
