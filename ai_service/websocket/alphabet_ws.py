import json
from fastapi import WebSocket, WebSocketDisconnect
from typing import Set

class AlphabetWebSocket:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.clients: Set[WebSocket] = set()  # Liste des clients connectés
        print(f"🧠 AlphabetWebSocket initialisé sur device = {self.device}")

    # =====================
    # CONNECTION
    # =====================
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.clients.add(websocket)
        print(f"🔌 Client connecté | total = {len(self.clients)}")

        try:
            while True:
                # Permet de détecter la fermeture distante
                await websocket.receive_text()
        except WebSocketDisconnect:
            print("❌ Client déconnecté")
        except Exception as e:
            print(f"❌ Erreur WS: {e}")
        finally:
            self.disconnect(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.clients:
            self.clients.remove(websocket)
            print(f"🧹 Client retiré | total = {len(self.clients)}")

    # =====================
    # BROADCAST
    # =====================
    async def send_letter(self, letter: str, confidence: float):
        if not self.clients:
            return

        payload = {
            "type": "letter",
            "payload": {
                "value": letter,
                "confidence": round(confidence, 3),
            }
        }

        message = json.dumps(payload)

        dead = []
        for ws in self.clients:
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)

        for ws in dead:
            self.disconnect(ws)
