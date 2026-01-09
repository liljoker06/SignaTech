# websocket/alphabet_ws.py
import json
from fastapi import WebSocket

class AlphabetWebSocket:
    def __init__(self):
        self.clients = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.clients.add(websocket)
        print("Scala connecté")

    def disconnect(self, websocket: WebSocket):
        self.clients.remove(websocket)
        print("Scala déconnecté")

    async def send_letter(self, letter, confidence):
        if not self.clients:
            return

        payload = {
            "type": "letter",
            "value": letter,
            "confidence": round(confidence, 3)
        }

        dead = []
        for ws in self.clients:
            try:
                await ws.send_text(json.dumps(payload))
            except:
                dead.append(ws)

        for ws in dead:
            self.clients.remove(ws)
