# 🤟 SignaTech

<div align="center">

![SignaTech Logo](https://img.shields.io/badge/SignaTech-Traduction_Langue_des_Signes-FFE658?style=for-the-badge&logo=hand&logoColor=black)

**Traduction en temps réel de l'alphabet ASL (fingerspelling) via IA**

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Scala](https://img.shields.io/badge/Scala-2.13-DC322F?style=flat-square&logo=scala)](https://www.scala-lang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-CUDA-EE4C2C?style=flat-square&logo=pytorch)](https://pytorch.org/)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Pipeline de traduction](#-pipeline-de-traduction)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Structure du projet](#-structure-du-projet)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

---

## 🎯 À propos

**SignaTech** est une application innovante qui traduit en temps réel **l'alphabet de la langue des signes américaine (ASL fingerspelling)** en texte. Utilisant la puissance de l'intelligence artificielle et de la vision par ordinateur, l'application capture les positions statiques des mains via la caméra du téléphone et reconnaît les lettres de A à Z.

### ✨ Fonctionnalités principales

- 📸 **Capture vidéo en temps réel** via la caméra du téléphone
- 🧠 **Détection des keypoints** avec MediaPipe (21 landmarks par main)
- 🤖 **Reconnaissance de lettres A-Z** via un réseau de neurones MLP entraîné sur l'alphabet ASL
- 🔄 **Filtrage intelligent** des répétitions avec Scala
- 💬 **Formation de mots** par épellation (fingerspelling)
- 🌐 **Architecture microservices** scalable et modulaire

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     📱 Mobile App                            │
│              (React Native + Expo Router)                    │
│         Capture frames caméra toutes les 300ms               │
└────────────────────┬────────────────────────────────────────┘
                     │ WebSocket (base64 frames)
                     │ ws://ngrok/ws/translate
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  🟢 Node.js Backend                          │
│                 (Express + WebSocket)                        │
│            Routage et orchestration des flux                 │
└──────┬─────────────────────────────────────────────┬────────┘
       │ WS → Python                                  │ WS → Scala
       │ localhost:8000/ws/translate                  │ localhost:8080/ws/filter
       ▼                                              ▼
┌──────────────────────────────┐    ┌────────────────────────────────┐
│   🐍 Python AI Service       │    │    🔴 Scala Filter Service     │
│   (FastAPI + PyTorch)        │───▶│    (Akka HTTP + WebSocket)     │
│                              │    │                                 │
│ 1. Décode base64 → image     │    │ 1. Reçoit prédictions Python   │
│ 2. MediaPipe → keypoints     │    │ 2. Buffer fenêtre glissante    │
│ 3. MLP → prédiction lettre   │    │ 3. Filtre répétitions (2/3)    │
│ 4. Confiance > 75%           │    │ 4. Reset après 2s inactivité   │
│ 5. Envoi à Scala             │    │ 5. Envoi lettre stable         │
└──────────────────────────────┘    └────────┬───────────────────────┘
                                             │
                                             │ Lettre filtrée
                                             ▼
                                    ┌─────────────────────┐
                                    │   🟢 Node.js        │
                                    │   Forward au mobile │
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │   📱 Mobile         │
                                    │   Affichage texte   │
                                    └─────────────────────┘
```

### 🔄 Flux de données

1. **Mobile** : Capture frame (300ms) → Base64
2. **Node.js** : Reçoit et route vers Python
3. **Python** : Extrait keypoints + Prédit lettre (confiance)
4. **Scala** : Filtre répétitions + Valide stabilité
5. **Node.js** : Retour vers mobile
6. **Mobile** : Affiche lettre + Reset après 6s inactivité

---

## 🛠️ Technologies

### Frontend Mobile
- **React Native** 0.81.5 - Framework mobile cross-platform
- **Expo Router** 54 - Navigation file-based
- **Expo Camera** - Capture vidéo en temps réel
- **WebSocket Client** - Communication temps réel

### Backend API
- **Node.js** 20+ - Runtime JavaScript
- **Express** 5.2 - Framework web
- **WebSocket (ws)** - Serveur WebSocket
- **GraphQL (Apollo)** - API GraphQL
- **PostgreSQL** - Base de données relationnelle

### Intelligence Artificielle
- **Python** 3.12 - Langage de l'IA
- **PyTorch** - Framework deep learning (CUDA)
- **MediaPipe** - Extraction de keypoints mains
- **FastAPI** - Framework web async
- **OpenCV** - Traitement d'images
- **NumPy** - Calcul numérique

### Service de Filtrage
- **Scala** 2.13 - Langage JVM fonctionnel
- **Akka HTTP** - Serveur HTTP/WebSocket
- **Circe** - Parsing JSON
- **SBT** - Build tool

---

## 📦 Prérequis

### Logiciels requis

- **Node.js** ≥ 20.0.0 ([Télécharger](https://nodejs.org/))
- **Python** ≥ 3.12 ([Télécharger](https://www.python.org/))
- **Java JDK** ≥ 17 ([Télécharger](https://adoptium.net/))
- **Scala & SBT** ([Télécharger](https://www.scala-lang.org/download/))
- **PostgreSQL** ≥ 14 ([Télécharger](https://www.postgresql.org/download/))
- **Git** ([Télécharger](https://git-scm.com/))

### Pour le mobile
- **Android Studio** (pour Android) ou **Xcode** (pour iOS)
- **Expo Go** app sur votre téléphone (optionnel)

### GPU (optionnel mais recommandé)
- **CUDA Toolkit** pour accélération GPU PyTorch

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/liljoker06/SignaTech.git
cd SignaTech
```

### 2. Backend Node.js

```bash
cd backend
npm install
```

Créer `.env` :
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/signatech
```

### 3. Service Python AI

```bash
cd ai_service
pip install -r requirements.txt
```

Le modèle pré-entraîné doit être présent dans `model/asl_alphabet.pth`

### 4. Service Scala

```bash
cd scala
sbt compile
```

### 5. Application Mobile

```bash
cd mobile-app
npm install
```

Créer `.env` :
```env
EXPO_PUBLIC_API_URL=https://votre-ngrok.ngrok-free.app/graphql
EXPO_PUBLIC_WS_URL=wss://votre-ngrok.ngrok-free.app/ws/translate
```

---

## 🎬 Démarrage

### Démarrage complet (4 terminaux)

#### Terminal 1 : Python AI Service
```bash
cd ai_service
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
✅ Service démarré sur http://localhost:8000

#### Terminal 2 : Scala Filter Service
```bash
cd scala
sbt run
```
✅ Service démarré sur http://localhost:8080

#### Terminal 3 : Node.js Backend
```bash
cd backend
npm run dev
```
✅ API démarrée sur http://localhost:4000

#### Terminal 4 : Mobile App
```bash
cd mobile-app
npm start
```
Puis scannez le QR code avec Expo Go ou lancez sur un émulateur.

### Configuration Ngrok (pour téléphone physique)

```bash
ngrok http 4000
```

Copiez l'URL ngrok dans `mobile-app/.env` :
```env
EXPO_PUBLIC_WS_URL=wss://xxxx.ngrok-free.app/ws/translate
```

---

## 🔍 Pipeline de traduction

### Détails techniques

#### 1. Capture Mobile (300ms interval)
```javascript
const photo = await cameraRef.takePictureAsync({
  quality: 0.3,
  base64: true,
  skipProcessing: true,
});
sendFrame(photo.base64);
```

#### 2. Extraction Keypoints (Python)
```python
# MediaPipe détecte 21 landmarks × 3 coords = 63 features
# Padding à 165 features pour le modèle
keypoints = extract_hand_keypoints(frame)  # (55, 3)
keypoints_flat = keypoints.flatten()[:165]
```

#### 3. Prédiction IA (PyTorch MLP)
```python
# Modèle : 165 → 256 → 128 → 26 classes (lettres A-Z)
# Reconnaît les positions statiques de la main
output = model(tensor)
probs = torch.softmax(output, dim=1)
confidence, predicted = torch.max(probs, 1)  # Lettre prédite
```

#### 4. Filtrage Scala
```scala
// Buffer fenêtre glissante (3 frames)
// Envoi immédiat si confiance > 95%
// Sinon, minimum 2/3 occurrences
// Reset après 2s d'inactivité
```

#### 5. Affichage Mobile
```javascript
// Accumulation des lettres
setTranslatedText(prev => prev + data.value);
// Auto-effacement après 6s d'inactivité
setTimeout(() => setTranslatedText(''), 6000);
```

---

## ⚙️ Configuration

### Variables d'environnement

#### Backend (`backend/.env`)
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/signatech
NODE_ENV=development
```

#### Mobile (`mobile-app/.env`)
```env
# Développement local (émulateur)
EXPO_PUBLIC_WS_URL=ws://localhost:4000/ws/translate

# Production (ngrok)
EXPO_PUBLIC_WS_URL=wss://xxxx.ngrok-free.app/ws/translate
```

### Paramètres du filtrage Scala

Modifier dans `FilterWebSocketServer.scala` :
```scala
private val WINDOW_SIZE = 3           // Taille buffer
private val MIN_OCCURRENCES = 2       // Occurrences minimum
private val CONFIDENCE_THRESHOLD = 0.75  // Seuil confiance
```

### Paramètres de capture Mobile

Modifier dans `translate.js` :
```javascript
const interval = setInterval(async () => {
  // ...
}, 300);  // Fréquence de capture (ms)
```

---

## 👨‍💻 Développement

### Structure des commandes

```bash
# Backend
npm run dev          # Nodemon avec hot-reload
npm start            # Production

# Mobile
npm start            # Expo dev server
npm run android      # Émulateur Android
npm run ios          # Simulateur iOS

# Python
python -m uvicorn main:app --reload  # Hot-reload

# Scala
sbt run              # Compilation et lancement
sbt compile          # Compilation seule
```

### Tests

```bash
# Backend
cd backend
npm test

# Python (si tests disponibles)
cd ai_service
pytest
```

### Debugging

#### Logs Python détaillés
Les logs montrent chaque étape :
```
📦 Message #42 reçu (longueur: 90766)
📝 Type de message: frame
🎬 Traitement d'une frame...
✅ Frame décodée: (1920, 954, 3)
✅ Keypoints extraits: (55, 3)
🔍 Prédiction: V (0.97)
✉️ Envoyé: V
```

#### Logs Scala détaillés
```
[Scala Filter] Reçu: V (0.9992476...)
[Scala Filter] ✓ Envoi: V
```

#### Logs Mobile
```
[Recording] 📸 Tentative de capture...
[Recording] ✅ Frame capturée, envoi...
[TranslateWS] 📤 Envoi frame (longueur base64: 90740)
[Recording] 📨 Reçu du backend: {type: 'letter', value: 'V', ...}
```

---

## 📁 Structure du projet

```
SignaTech/
├── 📱 mobile-app/           # Application React Native
│   ├── app/
│   │   ├── (tabs)/          # Écrans tab navigation
│   │   │   └── translate.js # ⭐ Écran principal traduction
│   │   ├── auth/            # Authentification
│   │   └── _layout.js       # Layout racine
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   └── services/
│   │       └── websocket/   # Client WebSocket
│   └── package.json
│
├── 🟢 backend/              # API Node.js + WebSocket
│   ├── src/
│   │   ├── controllers/     # Contrôleurs GraphQL/REST
│   │   ├── models/          # Modèles Sequelize
│   │   ├── routes/          # Routes Express
│   │   └── config/          # Configuration DB
│   ├── websocket/
│   │   └── routes/
│   │       └── websocket.routes.js  # ⭐ Routage WS
│   └── server.js            # Point d'entrée
│
├── 🐍 ai_service/           # Service IA Python
│   ├── main.py              # ⭐ API FastAPI + WebSocket
│   ├── mediapipe_extractor.py  # ⭐ Extraction keypoints
│   ├── model/
│   │   ├── asl_alphabet_mlp.py  # Architecture réseau MLP
│   │   └── asl_alphabet.pth     # Modèle entraîné (26 lettres)
│   ├── datasets/
│   │   └── asl_images/      # Dataset alphabet ASL (A-Z)
│   ├── vision/
│   │   └── webcam_loop.py   # Test webcam
│   └── requirements.txt
│
├── 🔴 scala/                # Service Scala filtrage
│   ├── src/main/scala/com/signatech/
│   │   ├── Main.scala       # Point d'entrée
│   │   └── websocket/
│   │       └── FilterWebSocketServer.scala  # ⭐ Filtrage
│   └── build.sbt
│
├── README.MD                # 📖 Ce fichier
├── PIPELINE.md              # Documentation pipeline
└── .gitignore
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add: AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Guidelines

- Suivre les conventions de nommage existantes
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les changements dans le README si nécessaire
- Vérifier que tous les services compilent avant de push

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👥 Auteurs

- **[@liljoker06](https://github.com/liljoker06)** - développement IA, architecture du projet et DevOps
- **[@Batyeste](https://github.com/Batyeste)** - Backend Node.js, GraphQL et développement frontend
- **[@ayaej](https://github.com/ayaej)** - Développement frontend mobile React Native
- **[@ahamie71](https://github.com/ahamie71)** - Scrapping en Scala

---

## 🙏 Remerciements

- **MediaPipe** pour la détection des keypoints de mains
- **PyTorch** pour le framework de deep learning
- **Expo** pour le développement mobile simplifié
- La communauté open-source pour les outils et bibliothèques

---

<div align="center">

**Fait avec ❤️ et 🤟 pour l'accessibilité**

[⬆ Retour en haut](#-signatech)

</div>

## 🚀 Lancement du projet

Bienvenue sur **SignaTech** ! Ce projet est actuellement en phase de démarrage.

### Statut
🔧 En développement

### À propos
Ce repository contient le code source du projet SignaTech développé en Scala.

---
*Dernière mise à jour : [Date]*