# vision/webcam_loop.py
import cv2
import torch
import numpy as np
from collections import deque

from model.asl_alphabet_mlp import ASLAlphabetMLP
from mediapipe_extractor import extract_hand_keypoints

LETTERS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
STABILITY_FRAMES = 12
CONF_THRESHOLD = 0.70

class WebcamLoop:
    def __init__(self, ws_sender, device="cpu"):
        self.ws = ws_sender
        self.device = device
        self.buffer = deque(maxlen=STABILITY_FRAMES)

        self.model = ASLAlphabetMLP().to(device)
        self.model.load_state_dict(
            torch.load("model/asl_alphabet.pth", map_location=device)
        )
        self.model.eval()

    async def run(self):
        cap = cv2.VideoCapture(0)
        print("🎥 Webcam active (serveur Python)")

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            keypoints = extract_hand_keypoints(frame)
            if keypoints is None:
                self.buffer.clear()
                continue

            x = torch.tensor(
                keypoints.flatten(),
                dtype=torch.float32
            ).unsqueeze(0).to(self.device)

            with torch.no_grad():
                out = self.model(x)
                probs = torch.softmax(out, dim=1)
                conf, pred = probs.max(dim=1)

            self.buffer.append((pred.item(), conf.item()))

            if len(self.buffer) == STABILITY_FRAMES:
                labels = [b[0] for b in self.buffer]
                confidences = [b[1] for b in self.buffer]

                best = max(set(labels), key=labels.count)
                avg_conf = sum(confidences) / len(confidences)

                if avg_conf >= CONF_THRESHOLD:
                    letter = LETTERS[best]
                    print(f"➡️ LETTRE envoyée : {letter} ({avg_conf:.2%})")
                    await self.ws.send_letter(letter, avg_conf)

                self.buffer.clear()

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        cap.release()
        cv2.destroyAllWindows()
