import torch
import torch.nn as nn
import torch.optim as optim
from tqdm import tqdm

from data_loader import get_dataloader
from efficientnet_model import get_efficientnet_b0

# ---------------- CONFIG ----------------

TRAIN_DIR = "dataset/processed/train"
TEST_DIR  = "dataset/processed/test"

IMAGE_SIZE = 64
BATCH_SIZE = 64
EPOCHS = 10
LR = 3e-4

# ----------------------------------------


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    train_loader, train_dataset = get_dataloader(
        TRAIN_DIR, train=True, image_size=IMAGE_SIZE, batch_size=BATCH_SIZE
    )

    test_loader, test_dataset = get_dataloader(
        TEST_DIR, train=False, image_size=IMAGE_SIZE, batch_size=BATCH_SIZE
    )

    model = get_efficientnet_b0(num_classes=52).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LR)

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

    torch.save(model.state_dict(), "efficientnet_b0.pth")
    print("✅ EfficientNet-B0 model saved as efficientnet_b0.pth")


if __name__ == "__main__":
    main()
