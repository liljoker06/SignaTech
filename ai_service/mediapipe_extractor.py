import cv2
import numpy as np
import base64
import json

try:
    import mediapipe as mp
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    
    # Configuration pour traitement en temps réel
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
except AttributeError:
    print("❌ MediaPipe non installé correctement")
    exit(1)


def extract_hand_keypoints(input_data):
    try:
        if isinstance(input_data, np.ndarray):
            image = input_data
        else:
            return None

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)

        if not results.multi_hand_landmarks:
            return None

        hand = results.multi_hand_landmarks[0]

        keypoints = []
        for lm in hand.landmark:
            keypoints.extend([lm.x, lm.y, lm.z])

        keypoints = np.array(keypoints, dtype=np.float32)

        # Adapter à 55 nodes
        num_repeats = 55 * 3 // keypoints.shape[0] + 1
        keypoints = np.tile(keypoints, num_repeats)[:55 * 3]

        reshaped = keypoints.reshape(55, 3)

        # 🔥 NORMALISATION
        reshaped = normalize_keypoints(reshaped)

        return reshaped

    except Exception as e:
        print(f"❌ Erreur extraction keypoints: {e}")
        return None

def draw_hand_landmarks(frame, keypoints):
    """
    Dessine les landmarks sur l'image (pour débogage)
    
    Args:
        frame: Image CV2
        keypoints: Array de keypoints flatten (165,) ou (63,)
    """
    if keypoints is None:
        return frame
    
    # Convertir les keypoints normalisés en coordonnées pixel
    h, w, _ = frame.shape
    
    # Prendre seulement les 21 premiers landmarks (63 valeurs)
    keypoints_subset = keypoints[:63]
    
    for i in range(0, len(keypoints_subset), 3):
        x = int(keypoints_subset[i] * w)
        y = int(keypoints_subset[i + 1] * h)
        
        # S'assurer que les coordonnées sont dans l'image
        if 0 <= x < w and 0 <= y < h:
            cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)
    
    return frame

##   normalized coordinates (0-1) relative to image size
def normalize_keypoints(keypoints):
    kp = keypoints.copy()
    wrist = kp[0]
    kp -= wrist  # recentrer sur le poignet

    scale = np.linalg.norm(kp[9]) + 1e-6  # distance au majeur
    kp /= scale  # normaliser la taille
    return kp

