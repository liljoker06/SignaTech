import cv2
import mediapipe as mp
import numpy as np

from ai_service.video_buffer import VideoFrameBuffer

# MediaPipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Buffer vidéo
buffer = VideoFrameBuffer(max_frames=16)

cap = cv2.VideoCapture(0)

print("Extraction des keypoints - Appuie sur Q pour quitter")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)

    if results.multi_hand_landmarks:
        hand = results.multi_hand_landmarks[0]

        keypoints = []
        for landmark in hand.landmark:
            keypoints.extend([landmark.x, landmark.y, landmark.z])

        keypoints = np.array(keypoints, dtype=np.float32)

        print("Keypoints shape:", keypoints.shape)
        print(keypoints[:6])

        buffer.add(keypoints)

        if buffer.is_ready():
            sequence = buffer.get_sequence()
            print("SEQUENCE READY:", sequence.shape)  # (1, 16, 63)
            buffer.clear()

        mp_drawing.draw_landmarks(
            frame,
            hand,
            mp_hands.HAND_CONNECTIONS
        )

    cv2.imshow("Keypoints extraction", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
