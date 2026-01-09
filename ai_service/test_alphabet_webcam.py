import cv2
import torch
import numpy as np
from collections import deque, Counter
import mediapipe as mp

from model.asl_alphabet_mlp import ASLAlphabetMLP

# =====================
# CONFIG
# =====================
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_PATH = "model/asl_alphabet.pth"

LETTERS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

STABILITY_FRAMES = 12
CONF_THRESHOLD = 0.70

print(f"🔥 Device: {DEVICE}")

# =====================
# MEDIAPIPE
# =====================
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

# =====================
# MODEL
# =====================
model = ASLAlphabetMLP().to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()

print("✅ Modèle alphabet chargé")

# =====================
# UTILS
# =====================
def normalize_keypoints(kp):
    kp = kp.reshape(21, 3)
    # Centrage sur le poignet
    wrist = kp[0].copy()
    kp -= wrist
    # Normalisation par la longueur du majeur
    scale = np.linalg.norm(kp[9]) + 1e-6
    kp /= scale
    kp = kp.flatten()  # (63,)
    # ADAPTATION AU MODÈLE (63 → 165)
    repeats = 165 // kp.shape[0] + 1
    kp = np.tile(kp, repeats)[:165]

    return kp

# =====================
# CAMERA
# =====================
cap = cv2.VideoCapture(0)
pred_buffer = deque(maxlen=STABILITY_FRAMES)

print("🎥 Webcam active — montre une lettre ASL")

# =====================
# LOOP
# =====================
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        hand = results.multi_hand_landmarks[0]

        # Draw landmarks
        mp_drawing.draw_landmarks(
            frame,
            hand,
            mp_hands.HAND_CONNECTIONS
        )

        # Extract keypoints
        kp = []
        for lm in hand.landmark:
            kp.extend([lm.x, lm.y, lm.z])

        kp = normalize_keypoints(np.array(kp, dtype=np.float32))

        x = torch.tensor(kp).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            out = model(x)
            probs = torch.softmax(out, dim=1)
            conf, pred = probs.max(dim=1)

        pred_buffer.append((pred.item(), conf.item()))

        if len(pred_buffer) == STABILITY_FRAMES:
            labels = [p[0] for p in pred_buffer]
            confidences = [p[1] for p in pred_buffer]

            best_label = Counter(labels).most_common(1)[0][0]
            best_conf = max(confidences)

            if best_conf > CONF_THRESHOLD:
                letter = LETTERS[best_label]
                cv2.putText(
                    frame,
                    f"LETTRE : {letter}",
                    (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.6,
                    (0, 255, 0),
                    3
                )

    cv2.imshow("ASL Alphabet Live", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
hands.close()
print("🛑 Test terminé")
