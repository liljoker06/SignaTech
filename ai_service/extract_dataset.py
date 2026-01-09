import os
import cv2
import numpy as np
from mediapipe_extractor import extract_hand_keypoints

INPUT_DIR = "datasets/asl_images"
OUTPUT_DIR = "datasets/asl_keypoints"

os.makedirs(OUTPUT_DIR, exist_ok=True)

letters = [chr(i) for i in range(ord("A"), ord("Z") + 1)]

total = 0
failed = 0

for letter in letters:
    input_letter_dir = os.path.join(INPUT_DIR, letter)
    output_letter_dir = os.path.join(OUTPUT_DIR, letter)
    os.makedirs(output_letter_dir, exist_ok=True)

    images = os.listdir(input_letter_dir)

    print(f"🔠 Traitement lettre {letter} ({len(images)} images)")

    for idx, img_name in enumerate(images):
        img_path = os.path.join(input_letter_dir, img_name)
        image = cv2.imread(img_path)

        if image is None:
            failed += 1
            continue

        keypoints = extract_hand_keypoints(image)

        if keypoints is None:
            failed += 1
            continue

        # keypoints shape: (55, 3) ou (21,3) selon ton extractor
        keypoints = keypoints.flatten()  # (165,) ou (63,)

        out_path = os.path.join(
            output_letter_dir,
            f"{letter}_{idx:05d}.npy"
        )

        np.save(out_path, keypoints)
        total += 1

print("✅ Extraction terminée")
print(f"📦 Samples créés: {total}")
print(f"⚠️  Échecs MediaPipe: {failed}")
