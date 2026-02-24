import os
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# ----------------------------------------

def get_transforms(train=True, image_size=64):
    if train:
        return transforms.Compose([
            transforms.Grayscale(num_output_channels=3),  # EfficientNet expects 3 channels
            transforms.Resize((image_size, image_size)),
            transforms.RandomRotation(10),
            transforms.RandomAffine(
                degrees=0,
                translate=(0.1, 0.1),
                scale=(0.9, 1.1)
            ),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.5, 0.5, 0.5],
                std=[0.5, 0.5, 0.5]
            )
        ])
    else:
        return transforms.Compose([
            transforms.Grayscale(num_output_channels=3),
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.5, 0.5, 0.5],
                std=[0.5, 0.5, 0.5]
            )
        ])


def get_dataloader(data_dir, train=True, image_size=64, batch_size=64):
    dataset = datasets.ImageFolder(
        root=data_dir,
        transform=get_transforms(train, image_size)
    )

    loader = DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=train,
        num_workers=4,
        pin_memory=True,
        persistent_workers=True
    )

    return loader, dataset
