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
    damage_index = int(data["damage_class_index"])

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

    return model, tf, class_to_idx, damage_index


@torch.no_grad()
def predict_image_bytes(model: nn.Module, tf: transforms.Compose, image_bytes: bytes, damage_index: int, device: Optional[str] = None) -> Dict:
    if device is None:
        device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    x = tf(img).unsqueeze(0).to(device)
    model = model.to(device)
    logits = model(x)[0]
    probs = torch.softmax(logits, dim=-1).cpu().numpy()
    pred_idx = int(probs.argmax())
    damaged = bool(probs[damage_index] >= 0.5)
    return {
        "pred_idx": pred_idx,
        "probs": probs.tolist(),
        "damaged": damaged,
        "damage_prob": float(probs[damage_index]),
    }

