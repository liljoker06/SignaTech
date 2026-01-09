# main.py
import torch
import json
import base64
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from websocket.alphabet_ws import AlphabetWebSocket
from model.asl_alphabet_mlp import ASLAlphabetMLP
from mediapipe_extractor import extract_hand_keypoints
from collections import deque

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔥 Device Python: {DEVICE}")

# Chargement du modèle
model = ASLAlphabetMLP().to(DEVICE)
try:
    model.load_state_dict(torch.load("model/asl_alphabet.pth", map_location=DEVICE))
    model.eval()
    print("✅ Modèle ASL chargé avec succès")
except Exception as e:
    print(f"❌ Erreur chargement modèle: {e}")

LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

app = FastAPI()
ws_manager = AlphabetWebSocket(device=DEVICE)

# Buffer pour filtrer les répétitions
class LetterBuffer:
    def __init__(self, window_size=5, threshold=0.7):
        self.window = deque(maxlen=window_size)
        self.threshold = threshold
        self.last_sent = None
    
    def add_prediction(self, letter, confidence):
        self.window.append((letter, confidence))
        
        # Vérifier si la même lettre apparaît majoritairement
        if len(self.window) >= 3:
            letter_counts = {}
            for l, c in self.window:
                if c > self.threshold:
                    letter_counts[l] = letter_counts.get(l, 0) + 1
            
            if letter_counts:
                most_common = max(letter_counts.items(), key=lambda x: x[1])
                if most_common[1] >= 3 and most_common[0] != self.last_sent:
                    self.last_sent = most_common[0]
                    return most_common[0]
        
        return None

letter_buffer = LetterBuffer()

@app.websocket("/ws/translate")
async def translate_socket(websocket: WebSocket):
    await websocket.accept()
    print("✅ Client Node.js connecté")
    
    frame_count = 0
    
    try:
        while True:
            message = await websocket.receive_text()
            frame_count += 1
            
            print(f"📦 Message #{frame_count} reçu (longueur: {len(message)})")
            
            try:
                data = json.loads(message)
                print(f"📝 Type de message: {data.get('type', 'UNKNOWN')}")
            except json.JSONDecodeError as e:
                print(f"❌ Erreur JSON: {e}")
                print(f"📄 Message brut (100 premiers chars): {message[:100]}")
                continue
            
            if data.get('type') == 'frame':
                print("🎬 Traitement d'une frame...")
                
                # Décoder l'image base64
                try:
                    img_data = base64.b64decode(data['data'])
                    nparr = np.frombuffer(img_data, np.uint8)
                    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    
                    if frame is None:
                        print("❌ Frame None après décodage")
                        continue
                    
                    print(f"✅ Frame décodée: {frame.shape}")
                except Exception as e:
                    print(f"❌ Erreur décodage frame: {e}")
                    continue
                
                # Extraire les keypoints
                keypoints = extract_hand_keypoints(frame)
                
                if keypoints is not None:
                    print(f"✅ Keypoints extraits: {keypoints.shape}")
                    
                    # Convertir en tensor pour le modèle
                    keypoints_flat = keypoints.flatten()[:165]  # S'assurer de 165 features
                    
                    if len(keypoints_flat) < 165:
                        # Padding si nécessaire
                        keypoints_flat = np.pad(keypoints_flat, (0, 165 - len(keypoints_flat)))
                    
                    tensor = torch.tensor(keypoints_flat, dtype=torch.float32).unsqueeze(0).to(DEVICE)
                    
                    # Prédiction
                    with torch.no_grad():
                        output = model(tensor)
                        probs = torch.softmax(output, dim=1)
                        confidence, predicted = torch.max(probs, 1)
                        
                        letter = LABELS[predicted.item()]
                        conf_value = confidence.item()
                        
                        print(f"🔍 Prédiction: {letter} ({conf_value:.2f})")
                        
                        # Filtrer avec le buffer
                        stable_letter = letter_buffer.add_prediction(letter, conf_value)
                        
                        if stable_letter:
                            response = {
                                'type': 'letter',
                                'value': stable_letter,
                                'confidence': conf_value
                            }
                            await websocket.send_text(json.dumps(response))
                            print(f"✉️ Envoyé: {stable_letter}")
                else:
                    print("⚠️ Aucune main détectée dans la frame")
                
    except WebSocketDisconnect:
        print("❌ Client déconnecté")
    except Exception as e:
        print(f"❌ Erreur WebSocket: {e}")
        import traceback
        traceback.print_exc()

