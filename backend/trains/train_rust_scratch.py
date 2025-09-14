import argparse
import json
import os
from dataclasses import dataclass
from typing import Dict, Tuple, List

import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.utils.data import DataLoader, Dataset
from torchvision import datasets, transforms, models
from PIL import Image
import pandas as pd


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


@dataclass
class TrainConfig:
    data_root: str
    train_subdir: str
    val_subdir: str
    output_dir: str
    epochs: int
    batch_size: int
    learning_rate: float
    weight_decay: float
    num_workers: int
    image_size: int
    arch: str


def build_transforms(image_size: int) -> Tuple[transforms.Compose, transforms.Compose]:
    train_tf = transforms.Compose(
        [
            transforms.Resize(int(image_size * 1.1)),
            transforms.RandomResizedCrop(image_size, scale=(0.8, 1.0), ratio=(0.75, 1.33)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.25, hue=0.05),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ]
    )
    val_tf = transforms.Compose(
        [
            transforms.Resize(int(image_size * 1.1)),
            transforms.CenterCrop(image_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ]
    )
    return train_tf, val_tf


class CSVImageDataset(Dataset):
    def __init__(self, root_dir: str, transform: transforms.Compose) -> None:
        self.root_dir = root_dir
        self.transform = transform
        csv_path = os.path.join(root_dir, "_classes.csv")
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Missing _classes.csv in {root_dir}")
        df = pd.read_csv(csv_path)
        if "filename" not in df.columns:
            raise RuntimeError("_classes.csv must contain a 'filename' column")
        self.class_names: List[str] = [c for c in df.columns if c != "filename"]
        if len(self.class_names) < 2:
            raise RuntimeError("Expected at least 2 class columns in _classes.csv")
        self.samples: List[Tuple[str, int]] = []
        for _, row in df.iterrows():
            fname = str(row["filename"]).strip()
            one_hot = [int(row.get(c, 0)) for c in self.class_names]
            label_idx = int(max(range(len(one_hot)), key=lambda i: one_hot[i]))
            path = os.path.join(root_dir, fname)
            if os.path.exists(path):
                self.samples.append((path, label_idx))
        if not self.samples:
            raise RuntimeError(f"No image paths found from _classes.csv in {root_dir}")
        self.class_to_idx: Dict[str, int] = {name: i for i, name in enumerate(self.class_names)}

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int):
        path, label = self.samples[idx]
        img = Image.open(path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, label


def build_dataloaders(cfg: TrainConfig) -> Tuple[DataLoader, DataLoader, Dict[str, int]]:
    train_dir = os.path.join(cfg.data_root, cfg.train_subdir)
    val_dir = os.path.join(cfg.data_root, cfg.val_subdir)

    train_tf, val_tf = build_transforms(cfg.image_size)

    # Prefer Roboflow CSV format if present; otherwise use ImageFolder
    if os.path.exists(os.path.join(train_dir, "_classes.csv")) and os.path.exists(os.path.join(val_dir, "_classes.csv")):
        train_ds = CSVImageDataset(train_dir, transform=train_tf)
        val_ds = CSVImageDataset(val_dir, transform=val_tf)
        class_to_idx = train_ds.class_to_idx
    else:
        train_ds = datasets.ImageFolder(train_dir, transform=train_tf)
        val_ds = datasets.ImageFolder(val_dir, transform=val_tf)
        class_to_idx = train_ds.class_to_idx

    train_loader = DataLoader(
        train_ds,
        batch_size=cfg.batch_size,
        shuffle=True,
        num_workers=cfg.num_workers,
        pin_memory=True,
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=cfg.batch_size,
        shuffle=False,
        num_workers=cfg.num_workers,
        pin_memory=True,
    )
    return train_loader, val_loader, class_to_idx


def build_model(arch: str, num_classes: int) -> nn.Module:
    arch = arch.lower()
    if arch == "resnet18":
        weights = models.ResNet18_Weights.IMAGENET1K_V1
        model = models.resnet18(weights=weights)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
        return model
    if arch == "efficientnet_b0":
        weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1
        model = models.efficientnet_b0(weights=weights)
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, num_classes)
        return model
    raise ValueError(f"Unsupported arch: {arch}")


def evaluate(model: nn.Module, loader: DataLoader, device: str) -> Tuple[float, float]:
    model.eval()
    total = 0
    correct = 0
    total_loss = 0.0
    loss_fn = nn.CrossEntropyLoss()
    with torch.no_grad():
        for images, targets in loader:
            images = images.to(device, non_blocking=True)
            targets = targets.to(device, non_blocking=True)
            logits = model(images)
            loss = loss_fn(logits, targets)
            total_loss += float(loss.item()) * images.size(0)
            preds = logits.argmax(dim=1)
            correct += int((preds == targets).sum().item())
            total += int(images.size(0))
    avg_loss = total_loss / max(1, total)
    acc = correct / max(1, total)
    return avg_loss, acc


def train(cfg: TrainConfig) -> str:
    os.makedirs(cfg.output_dir, exist_ok=True)

    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    print({"device": device})

    train_loader, val_loader, class_to_idx = build_dataloaders(cfg)
    num_classes = len(class_to_idx)

    model = build_model(cfg.arch, num_classes).to(device)

    loss_fn = nn.CrossEntropyLoss()
    optimizer = AdamW(model.parameters(), lr=cfg.learning_rate, weight_decay=cfg.weight_decay)

    best_val_acc = -1.0
    best_ckpt_path = os.path.join(cfg.output_dir, "rust_scratch.pt")

    for epoch in range(1, cfg.epochs + 1):
        model.train()
        total = 0
        running_loss = 0.0
        running_correct = 0
        for images, targets in train_loader:
            images = images.to(device, non_blocking=True)
            targets = targets.to(device, non_blocking=True)
            optimizer.zero_grad(set_to_none=True)
            logits = model(images)
            loss = loss_fn(logits, targets)
            loss.backward()
            optimizer.step()

            running_loss += float(loss.item()) * images.size(0)
            preds = logits.argmax(dim=1)
            running_correct += int((preds == targets).sum().item())
            total += int(images.size(0))

        train_loss = running_loss / max(1, total)
        train_acc = running_correct / max(1, total)
        val_loss, val_acc = evaluate(model, val_loader, device)

        print(
            json.dumps(
                {
                    "epoch": epoch,
                    "train_loss": round(train_loss, 4),
                    "train_acc": round(train_acc, 4),
                    "val_loss": round(val_loss, 4),
                    "val_acc": round(val_acc, 4),
                }
            )
        )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "class_to_idx": class_to_idx,
                    "arch": cfg.arch,
                    "image_size": cfg.image_size,
                    "mean": IMAGENET_MEAN,
                    "std": IMAGENET_STD,
                },
                best_ckpt_path,
            )
            print(json.dumps({"saved": best_ckpt_path, "val_acc": round(best_val_acc, 4)}))

    return best_ckpt_path


def parse_args() -> TrainConfig:
    parser = argparse.ArgumentParser(description="Train rust_vs_scratch (multi-class) classifier")
    parser.add_argument(
        "--data_root",
        type=str,
        default=os.path.join("datasets", "rust_and_scratch"),
        help="Root directory containing train/valid subfolders",
    )
    parser.add_argument("--train_subdir", type=str, default="train", help="Training subfolder name")
    parser.add_argument("--val_subdir", type=str, default="valid", help="Validation subfolder name")
    parser.add_argument("--output_dir", type=str, default=os.path.join("models"), help="Where to save model")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--learning_rate", type=float, default=3e-4)
    parser.add_argument("--weight_decay", type=float, default=1e-4)
    parser.add_argument("--num_workers", type=int, default=2)
    parser.add_argument("--image_size", type=int, default=224)
    parser.add_argument(
        "--arch",
        type=str,
        default="efficientnet_b0",
        choices=["efficientnet_b0", "resnet18"],
    )
    args = parser.parse_args()
    return TrainConfig(
        data_root=args.data_root,
        train_subdir=args.train_subdir,
        val_subdir=args.val_subdir,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        weight_decay=args.weight_decay,
        num_workers=args.num_workers,
        image_size=args.image_size,
        arch=args.arch,
    )


if __name__ == "__main__":
    cfg = parse_args()
    path = train(cfg)
    print(json.dumps({"best_checkpoint": path}))

