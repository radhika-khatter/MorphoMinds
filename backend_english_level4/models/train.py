import torch
import torch.nn as nn
import torch.optim as optim
from tqdm import tqdm

from data_loader import get_dataloader
from model import BaselineCNN


# ---------------- CONFIG ----------------

TRAIN_DIR = "dataset/processed/train"
TEST_DIR  = "dataset/processed/test"

BATCH_SIZE = 256
EPOCHS = 5          # baseline only
LR = 1e-3

# ----------------------------------------


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    train_loader, train_dataset = get_dataloader(TRAIN_DIR, train=True)
    test_loader, test_dataset = get_dataloader(TEST_DIR, train=False)

    model = BaselineCNN(num_classes=52).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        loop = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

        for images, labels in loop:
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

            loop.set_postfix(
                loss=running_loss / (total / BATCH_SIZE),
                acc=100 * correct / total
            )

        print(
            f"Epoch {epoch+1}: "
            f"Train Loss={running_loss/len(train_loader):.4f}, "
            f"Train Acc={100*correct/total:.2f}%"
        )

    # Save baseline model
    torch.save(model.state_dict(), "baseline_cnn.pth")
    print("✅ Baseline model saved as baseline_cnn.pth")


if __name__ == "__main__":
    main()
