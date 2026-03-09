import os
import torch
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
from sklearn.metrics import confusion_matrix, classification_report

from data_loader import get_dataloader
from efficientnet_model import get_efficientnet_b0


# ---------------- CONFIG ----------------

TEST_DIR = "dataset/processed/test"
MODEL_PATH = "efficientnet_b0.pth"
OUTPUT_DIR = "models/evaluation_outputs"

IMAGE_SIZE = 64
BATCH_SIZE = 64

# ---------------------------------------


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def plot_confusion_matrix(cm, class_names, save_path, top_k=20):
    """
    Plot confusion matrix for top_k most frequent classes
    """
    class_counts = cm.sum(axis=1)
    top_indices = np.argsort(class_counts)[-top_k:]

    cm_subset = cm[np.ix_(top_indices, top_indices)]
    class_subset = [class_names[i] for i in top_indices]

    plt.figure(figsize=(12, 10))
    plt.imshow(cm_subset, cmap="Blues")
    plt.colorbar()
    plt.xticks(range(len(class_subset)), class_subset, rotation=90)
    plt.yticks(range(len(class_subset)), class_subset)
    plt.title("Confusion Matrix (Top Classes)")
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()


def plot_per_class_recall(cm, class_names, save_path):
    recalls = []
    for i in range(len(class_names)):
        tp = cm[i, i]
        fn = cm[i].sum()
        recall = tp / fn if fn > 0 else 0
        recalls.append(recall)

    sorted_idx = np.argsort(recalls)

    plt.figure(figsize=(10, 12))
    plt.barh(
        [class_names[i] for i in sorted_idx],
        [recalls[i] for i in sorted_idx]
    )
    plt.xlabel("Recall")
    plt.title("Per-Class Recall (Worst → Best)")
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()

    return recalls


def main():
    ensure_dir(OUTPUT_DIR)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    # Load data
    test_loader, test_dataset = get_dataloader(
        TEST_DIR, train=False, image_size=IMAGE_SIZE, batch_size=BATCH_SIZE
    )
    class_names = test_dataset.classes

    # Load model
    model = get_efficientnet_b0(num_classes=len(class_names))
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()

    all_preds = []
    all_labels = []

    print("\nRunning EfficientNet-B0 evaluation...\n")

    with torch.no_grad():
        for images, labels in tqdm(test_loader):
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            outputs = model(images)
            preds = torch.argmax(outputs, dim=1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    # ---------------- METRICS ----------------

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    acc = (all_preds == all_labels).mean() * 100
    print(f"\n✅ Test Accuracy: {acc:.2f}%\n")

    print("📊 Classification Report:\n")
    print(classification_report(
        all_labels,
        all_preds,
        target_names=class_names,
        digits=3,
        zero_division=0
    ))

    cm = confusion_matrix(all_labels, all_preds)

    # ---------------- VISUALIZATIONS ----------------

    print("\n📈 Saving visualizations...")

    plot_confusion_matrix(
        cm,
        class_names,
        save_path=os.path.join(OUTPUT_DIR, "confusion_matrix.png")
    )

    recalls = plot_per_class_recall(
        cm,
        class_names,
        save_path=os.path.join(OUTPUT_DIR, "per_class_recall.png")
    )

    # ---------------- WORST CLASSES ----------------

    worst = sorted(
        zip(class_names, recalls),
        key=lambda x: x[1]
    )[:10]

    with open(os.path.join(OUTPUT_DIR, "worst_classes.txt"), "w") as f:
        f.write("Worst classes by recall:\n")
        for cls, r in worst:
            f.write(f"{cls}: {r:.3f}\n")

    print("\n🚨 Worst classes by recall:")
    for cls, r in worst:
        print(f"{cls}: {r:.3f}")

    print("\n✅ Evaluation complete.")
    print(f"📂 Outputs saved in: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
