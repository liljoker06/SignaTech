# main.py
import asyncio
import torch
from fastapi import FastAPI, WebSocket
from websocket.alphabet_ws import AlphabetWebSocket
from vision.webcam_loop import WebcamLoop

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔥 Device Python: {DEVICE}")

app = FastAPI()
ws_manager = AlphabetWebSocket()
webcam = WebcamLoop(ws_manager, device=DEVICE)

@app.websocket("/ws/alphabet")
async def alphabet_socket(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        ws_manager.disconnect(websocket)

@app.on_event("startup")
async def startup():
    asyncio.create_task(webcam.run())
