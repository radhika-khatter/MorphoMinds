import torch.nn as nn
from torchvision import models


def get_efficientnet_b0(num_classes=52):
    model = models.efficientnet_b0(weights="IMAGENET1K_V1")

    # Replace classifier head
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)

    return model
