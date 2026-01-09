import os
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from tqdm import tqdm

from model.asl_alphabet_mlp import ASLAlphabetMLP

# =====================
# CONFIG
# =====================
DATASET_DIR = "datasets/asl_keypoints"
EPOCHS = 20
BATCH_SIZE = 256
LR = 1e-3


# =====================
# DATASET
# =====================
class ASLDataset(Dataset):
    def __init__(self, root):
        self.samples = []
        self.labels = []

        letters = sorted(os.listdir(root))
        print(f"📁 Lettres trouvées: {letters}")

        for idx, letter in enumerate(letters):
            folder = os.path.join(root, letter)
            files = os.listdir(folder)
            print(f"🔠 {letter}: {len(files)} samples")

            for file in files:
                self.samples.append(os.path.join(folder, file))
                self.labels.append(idx)

        print(f"📦 Total samples: {len(self.samples)}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        x = np.load(self.samples[idx]).astype(np.float32)
        y = self.labels[idx]
        return torch.from_numpy(x), y


# =====================
# MAIN
# =====================
def main():
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🔥 Device utilisé: {DEVICE}")

    dataset = ASLDataset(DATASET_DIR)

    loader = DataLoader(
        dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0,          # ✅ OBLIGATOIRE Windows
        pin_memory=(DEVICE == "cuda")
    )

    model = ASLAlphabetMLP().to(DEVICE)
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)
    criterion = torch.nn.CrossEntropyLoss()

    print("🧠 Modèle initialisé")
    print("🚀 Démarrage entraînement alphabet ASL")

    for epoch in range(EPOCHS):
        model.train()
        correct = 0
        total = 0
        total_loss = 0

        loop = tqdm(loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

        for x, y in loop:
            x = x.to(DEVICE, non_blocking=True)
            y = y.to(DEVICE, non_blocking=True)

            optimizer.zero_grad()
            out = model(x)
            loss = criterion(out, y)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            pred = out.argmax(dim=1)
            correct += (pred == y).sum().item()
            total += y.size(0)

            loop.set_postfix(
                loss=f"{loss.item():.4f}",
                acc=f"{(correct / total) * 100:.2f}%"
            )

        print(f"✅ Epoch {epoch+1} terminé | Acc={(correct/total)*100:.2f}%")

    os.makedirs("model", exist_ok=True)
    torch.save(model.state_dict(), "model/asl_alphabet.pth")
    print("💾 Modèle sauvegardé: model/asl_alphabet.pth")


# =====================
# ENTRY POINT
# =====================
if __name__ == "__main__":
    main()
