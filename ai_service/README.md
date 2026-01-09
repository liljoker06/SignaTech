# SignaTech AI Service 🤟

Service d'extraction de keypoints de langue des signes avec MediaPipe pour la traduction en temps réel.

## ⚠️ Prérequis

- **Python 3.12.x** (testé avec 3.12.7 et 3.12.10)
- **Versions de packages compatibles** (conflit de dépendances entre MediaPipe et OpenCV)

## 🚀 Installation

### 1. Installer les dépendances avec les versions compatibles

**IMPORTANT:** MediaPipe 0.10.18 nécessite `numpy<2`, mais opencv-python 4.12+ nécessite `numpy>=2`. Utilisez ces versions compatibles :

```bash
pip install numpy==1.26.4 opencv-python==4.10.0.84 mediapipe==0.10.18 --force-reinstall
```

### 2. Installer les dépendances du serveur

```bash
pip install fastapi uvicorn websockets
```

### 3. Vérifier l'installation

```bash
python -c "import mediapipe as mp; import cv2; import numpy; print(f'MediaPipe: {mp.__version__}'); print(f'OpenCV: {cv2.__version__}'); print(f'NumPy: {numpy.__version__}'); print(mp.solutions.hands)"
```

**Sortie attendue :**
```
MediaPipe: 0.10.18
OpenCV: 4.10.0.84
NumPy: 1.26.4
<module 'mediapipe.python.solutions.hands' from '...'>
```

## 📦 Versions des packages compatibles

| Package | Version | Raison |
|---------|---------|--------|
| numpy | 1.26.4 | Compatible avec MediaPipe < 2.0 |
| opencv-python | 4.10.0.84 | Compatible avec numpy 1.26.4 |
| mediapipe | 0.10.18 | Dernière version stable |
| fastapi | latest | API serveur |
| uvicorn | latest | Serveur ASGI |
| websockets | latest | Communication temps réel |

## 🏃 Lancer le serveur

```bash
cd ai_service
uvicorn main:app --host 0.0.0.0 --port 8000
```

Le serveur sera accessible sur `http://localhost:8000`

## 🛠️ Résolution de problèmes

### Erreur : `module 'mediapipe' has no attribute 'solutions'`

**Causes possibles :**
1. **Conflit de versions** entre numpy, opencv-python et mediapipe
2. **Fichier mediapipe.py** dans le dossier courant qui masque le package
3. **Cache Python** corrompu

**Solutions :**

```bash
# 1. Réinstaller les bonnes versions
pip install numpy==1.26.4 opencv-python==4.10.0.84 mediapipe==0.10.18 --force-reinstall

# 2. Vérifier qu'il n'y a pas de fichier mediapipe.py local
dir mediapipe.py  # Windows
ls mediapipe.py   # Linux/Mac

# 3. Supprimer le cache Python
rmdir /s /q __pycache__  # Windows
rm -rf __pycache__       # Linux/Mac

# 4. Vérifier l'installation
python -c "import mediapipe as mp; print(mp.__version__); print(mp.solutions.hands)"
```

### Erreur : Conflit de dépendances avec numpy

Si pip affiche une erreur de conflit de dépendances :
- **NE PAS** installer `numpy>=2.0.0` avec MediaPipe 0.10.18
- **DOWNGRADER** opencv-python vers 4.10.0.84

```bash
pip uninstall numpy opencv-python mediapipe -y
pip cache purge
pip install numpy==1.26.4 opencv-python==4.10.0.84 mediapipe==0.10.18
```

## 📁 Structure du projet

```
ai_service/
├── main.py                      # Point d'entrée FastAPI
├── mediapipe_extractor.py       # Extraction de keypoints MediaPipe
├── extract_dataset.py           # Script d'extraction de dataset
├── train_alphabet.py            # Entraînement du modèle
├── test_alphabet_webcam.py      # Test avec webcam
├── video_buffer.py              # Buffer vidéo pour traitement
├── datasets/
│   ├── asl_images/              # Images ASL sources
│   └── asl_keypoints/           # Keypoints extraits (.npy)
├── model/
│   ├── asl_alphabet_mlp.py      # Modèle MLP
│   └── asl_alphabet.pth         # Poids du modèle
├── websocket/
│   └── alphabet_ws.py           # WebSocket pour temps réel
└── test/
    ├── extract_keypoints.py
    ├── gpu.py
    └── test_mediapipe.py
```

## 🔧 Configuration

Les paramètres MediaPipe sont dans [mediapipe_extractor.py](mediapipe_extractor.py) :

```python
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
```

## 📝 Notes

- MediaPipe 0.10.18 est la dernière version compatible avec Python 3.12 et numpy < 2
- Les versions plus récentes d'OpenCV (4.12+) nécessitent numpy >= 2, incompatible avec MediaPipe actuel
- Utilisez un environnement virtuel pour éviter les conflits avec d'autres projets

## 🤝 Contribution

Pour ajouter de nouvelles fonctionnalités, assurez-vous de respecter les versions de dépendances listées ci-dessus.
