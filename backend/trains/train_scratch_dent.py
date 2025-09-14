import argparse
import json
import os
from dataclasses import dataclass
from typing import Dict, Tuple

import torch
import torch.nn as nn
from torch.optim import Adam
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, models
import pandas as pd
from PIL import Image
import random


IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


@dataclass
class TrainConfig:
    data_root: str
    train_subdir: str
    output_dir: str
    epochs: int
    batch_size: int
    learning_rate: float
    weight_decay: float
    num_workers: int
    image_size: int
    arch: str
    subset_size: int  # Use only subset of data for faster training


def build_transforms(image_size: int) -> Tuple[transforms.Compose, transforms.Compose]:
    # Transforms for scratch-dent classification
    train_tf = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.RandomHorizontalFlip(p=0.3),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])
    val_tf = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])
    return train_tf, val_tf


class ScratchDentDataset(Dataset):
    def __init__(self, root_dir: str, transform: transforms.Compose, subset_size: int = None) -> None:
        self.root_dir = root_dir
        self.transform = transform
        csv_path = os.path.join(root_dir, "_classes.csv")
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Missing _classes.csv in {root_dir}")
        
        df = pd.read_csv(csv_path)
        if "filename" not in df.columns:
            raise RuntimeError("_classes.csv must contain a 'filename' column")
        
        # Get class names (all columns except filename)
        self.class_names = [c for c in df.columns if c != "filename"]
        expected_classes = ["dent", "scratch"]
        
        if len(self.class_names) != 2 or set(self.class_names) != set(expected_classes):
            raise RuntimeError(f"Expected classes {expected_classes}, got {self.class_names}")
        
        # Reorder to ensure consistent order
        self.class_names = expected_classes
        
        print(f"Found classes: {self.class_names}")
        
        self.samples = []
        for _, row in df.iterrows():
            fname = str(row["filename"]).strip()
            # Get the one-hot encoding
            one_hot = [int(row.get(c, 0)) for c in self.class_names]
            # Find the class with value 1
            label_idx = int(max(range(len(one_hot)), key=lambda i: one_hot[i]))
            
            path = os.path.join(root_dir, fname)
            if os.path.exists(path):
                self.samples.append((path, label_idx))
        
        # Use subset for faster training
        if subset_size and subset_size < len(self.samples):
            # Stratified sampling to keep class balance
            class_samples = [[] for _ in range(len(self.class_names))]
            for sample in self.samples:
                class_samples[sample[1]].append(sample)
            
            samples_per_class = subset_size // len(self.class_names)
            self.samples = []
            for class_idx, samples in enumerate(class_samples):
                if samples:
                    selected = random.sample(samples, min(samples_per_class, len(samples)))
                    self.samples.extend(selected)
            
            random.shuffle(self.samples)
        
        if not self.samples:
            raise RuntimeError(f"No image paths found from _classes.csv in {root_dir}")
        
        self.class_to_idx: Dict[str, int] = {name: i for i, name in enumerate(self.class_names)}
        print(f"Loaded {len(self.samples)} samples")
        
        # Print class distribution
        class_counts = [0] * len(self.class_names)
        for _, label in self.samples:
            class_counts[label] += 1
        for i, (class_name, count) in enumerate(zip(self.class_names, class_counts)):
            print(f"  {class_name}: {count} samples")

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int):
        path, label = self.samples[idx]
        try:
            img = Image.open(path).convert("RGB")
            if self.transform:
                img = self.transform(img)
            return img, label
        except Exception as e:
            print(f"Error loading {path}: {e}")
            # Return a black image as fallback
            img = Image.new('RGB', (224, 224), color='black')
            if self.transform:
                img = self.transform(img)
            return img, label


def build_dataloaders(cfg: TrainConfig) -> Tuple[DataLoader, DataLoader, Dict[str, int]]:
    train_dir = os.path.join(cfg.data_root, cfg.train_subdir)
    
    # Use subset for faster training
    train_tf, val_tf = build_transforms(cfg.image_size)
    
    # Load dataset with subset
    full_dataset = ScratchDentDataset(train_dir, train_tf, subset_size=cfg.subset_size)
    
    # Split dataset (80/20)
    total_size = len(full_dataset)
    train_size = int(0.8 * total_size)
    val_size = total_size - train_size
    
    train_dataset, val_dataset = torch.utils.data.random_split(
        full_dataset, [train_size, val_size]
    )
    
    # Create validation dataset with validation transforms
    val_dataset_full = ScratchDentDataset(train_dir, val_tf, subset_size=cfg.subset_size)
    val_indices = val_dataset.indices
    val_dataset = torch.utils.data.Subset(val_dataset_full, val_indices)
    
    class_to_idx = full_dataset.class_to_idx

    train_loader = DataLoader(
        train_dataset,
        batch_size=cfg.batch_size,
        shuffle=True,
        num_workers=cfg.num_workers,
        pin_memory=False,  # Disable for CPU
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=cfg.batch_size,
        shuffle=False,
        num_workers=cfg.num_workers,
        pin_memory=False,  # Disable for CPU
    )
    
    print(f"Train samples: {len(train_dataset)}, Val samples: {len(val_dataset)}")
    return train_loader, val_loader, class_to_idx


def build_model(arch: str, num_classes: int) -> nn.Module:
    """Build a lightweight model for faster training"""
    arch = arch.lower()
    if arch == "resnet18":
        # Use pretrained weights but don't download if not available
        try:
            model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        except:
            model = models.resnet18(weights=None)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
        return model
    elif arch == "mobilenet":
        # Even lighter model
        try:
            model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
        except:
            model = models.mobilenet_v2(weights=None)
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, num_classes)
        return model
    else:
        # Fallback: simple CNN
        model = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(128, num_classes)
        )
        return model


def evaluate(model: nn.Module, loader: DataLoader, device: str) -> Tuple[float, float]:
    model.eval()
    total = 0
    correct = 0
    running_loss = 0.0
    criterion = nn.CrossEntropyLoss()
    
    with torch.no_grad():
        for inputs, targets in loader:
            inputs, targets = inputs.to(device), targets.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            total += targets.size(0)
            correct += (predicted == targets).sum().item()
    
    accuracy = correct / total if total > 0 else 0.0
    avg_loss = running_loss / len(loader) if len(loader) > 0 else 0.0
    return avg_loss, accuracy


def train_epoch(model: nn.Module, loader: DataLoader, optimizer, criterion, device: str) -> Tuple[float, float]:
    model.train()
    total = 0
    correct = 0
    running_loss = 0.0
    
    for batch_idx, (inputs, targets) in enumerate(loader):
        inputs, targets = inputs.to(device), targets.to(device)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += targets.size(0)
        correct += (predicted == targets).sum().item()
        
        # Print progress every 10 batches
        if batch_idx % 10 == 0:
            print(f"  Batch {batch_idx}/{len(loader)}, Loss: {loss.item():.4f}")
    
    accuracy = correct / total if total > 0 else 0.0
    avg_loss = running_loss / len(loader) if len(loader) > 0 else 0.0
    return avg_loss, accuracy


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_root", type=str, default="datasets/scratch-dent-car.v1i.multiclass")
    parser.add_argument("--train_subdir", type=str, default="train")
    parser.add_argument("--output_dir", type=str, default="models")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch_size", type=int, default=16)
    parser.add_argument("--learning_rate", type=float, default=1e-3)
    parser.add_argument("--weight_decay", type=float, default=1e-4)
    parser.add_argument("--num_workers", type=int, default=0)
    parser.add_argument("--image_size", type=int, default=224)
    parser.add_argument("--arch", type=str, default="resnet18", choices=["resnet18", "mobilenet", "simple"])
    parser.add_argument("--subset_size", type=int, default=400, help="Use subset of data for faster training")
    
    args = parser.parse_args()
    
    cfg = TrainConfig(
        data_root=args.data_root,
        train_subdir=args.train_subdir,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        weight_decay=args.weight_decay,
        num_workers=args.num_workers,
        image_size=args.image_size,
        arch=args.arch,
        subset_size=args.subset_size,
    )
    
    # Create output directory
    os.makedirs(cfg.output_dir, exist_ok=True)
    
    # Set device
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    # Set random seed for reproducibility
    torch.manual_seed(42)
    random.seed(42)
    
    # Build dataloaders
    print("Building dataloaders...")
    train_loader, val_loader, class_to_idx = build_dataloaders(cfg)
    num_classes = len(class_to_idx)
    
    print(f"Class mapping: {class_to_idx}")
    
    # Build model
    print(f"Building {cfg.arch} model with {num_classes} classes...")
    model = build_model(cfg.arch, num_classes)
    print(f"Model architecture: {cfg.arch}")
    model = model.to(device)
    
    # Setup training
    criterion = nn.CrossEntropyLoss()
    optimizer = Adam(model.parameters(), lr=cfg.learning_rate, weight_decay=cfg.weight_decay)
    
    # Training loop
    best_val_acc = 0.0
    train_history = []
    
    print("Starting training...")
    for epoch in range(cfg.epochs):
        print(f"\nEpoch {epoch+1}/{cfg.epochs}")
        
        # Train
        train_loss, train_acc = train_epoch(model, train_loader, optimizer, criterion, device)
        
        # Validate
        val_loss, val_acc = evaluate(model, val_loader, device)
        
        # Log
        train_history.append({
            "epoch": epoch + 1,
            "train_loss": train_loss,
            "train_acc": train_acc,
            "val_loss": val_loss,
            "val_acc": val_acc,
        })
        
        print(f"Epoch {epoch+1:2d}/{cfg.epochs}: "
              f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f} | "
              f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            model_path = os.path.join(cfg.output_dir, "scratch_dent.pt")
            torch.save({
                'model_state_dict': model.state_dict(),
                'class_to_idx': class_to_idx,
                'arch': cfg.arch,
                'image_size': cfg.image_size,
                'best_val_acc': best_val_acc,
                'num_classes': num_classes,
            }, model_path)
            print(f"  -> Saved best model (val_acc: {val_acc:.4f})")
    
    # Save training history
    history_path = os.path.join(cfg.output_dir, "scratch_dent_history.json")
    with open(history_path, "w") as f:
        json.dump(train_history, f, indent=2)
    
    print(f"\nTraining completed!")
    print(f"Best validation accuracy: {best_val_acc:.4f}")
    print(f"Model saved to: {model_path}")
    print(f"Training history saved to: {history_path}")


if __name__ == "__main__":
    main()
