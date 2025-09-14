import io
import json
import os
from typing import Dict, Optional

import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms, models


def load_checkpoint(ckpt_path: str):
    data = torch.load(ckpt_path, map_location="cpu")
    arch = data.get("arch", "efficientnet_b0")
    image_size = int(data.get("image_size", 224))
    class_to_idx = data["class_to_idx"]
    positive_label = data.get("positive_label")

    if arch == "resnet18":
        weights = models.ResNet18_Weights.IMAGENET1K_V1
        model = models.resnet18(weights=weights)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, len(class_to_idx))
    elif arch == "efficientnet_b0":
        weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1
        model = models.efficientnet_b0(weights=weights)
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, len(class_to_idx))
    else:
        raise ValueError(f"Unsupported arch: {arch}")

    model.load_state_dict(data["model_state_dict"])
    model.eval()

    mean = data.get("mean", [0.485, 0.456, 0.406])
    std = data.get("std", [0.229, 0.224, 0.225])
    tf = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=mean, std=std),
        ]
    )

    idx_to_class = {v: k for k, v in class_to_idx.items()}
    positive_index = class_to_idx.get(positive_label) if positive_label in class_to_idx else None
    return model, tf, idx_to_class, positive_index


@torch.no_grad()
def predict_image_path(ckpt_path: str, image_path: str) -> Dict:
    model, tf, idx_to_class, positive_index = load_checkpoint(ckpt_path)
    img = Image.open(image_path).convert("RGB")
    x = tf(img).unsqueeze(0)
    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    model = model.to(device)
    x = x.to(device)
    logits = model(x)[0]
    probs = torch.softmax(logits, dim=-1).cpu().numpy()
    pred_idx = int(probs.argmax())
    is_dirty = None
    if positive_index is not None:
        is_dirty = bool(probs[positive_index] >= 0.5)
    return {
        "pred_idx": pred_idx,
        "pred_label": idx_to_class[pred_idx],
        "pred_score": float(probs[pred_idx]),
        "probs": probs.tolist(),
        "is_dirty": is_dirty,
    }

