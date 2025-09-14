import io
import json
import os
from typing import Dict, Optional

import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms, models


def build_model(arch: str, num_classes: int) -> nn.Module:
    """Build the same model architecture as in training"""
    arch = arch.lower()
    if arch == "resnet18":
        try:
            model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        except:
            model = models.resnet18(weights=None)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
        return model
    elif arch == "mobilenet":
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


def load_checkpoint(ckpt_path: str):
    """Load the damaged windows model checkpoint."""
    data = torch.load(ckpt_path, map_location="cpu")
    arch = data.get("arch", "resnet18")
    image_size = int(data.get("image_size", 224))
    class_to_idx = data["class_to_idx"]
    num_classes = data.get("num_classes", len(class_to_idx))

    # Build model
    model = build_model(arch, num_classes)
    model.load_state_dict(data["model_state_dict"])
    model.eval()

    # Create transforms
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    tf = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std),
    ])

    return model, tf, class_to_idx


@torch.no_grad()
def predict_image_bytes(model: nn.Module, tf: transforms.Compose, image_bytes: bytes, class_to_idx: Dict[str, int], device: Optional[str] = None) -> Dict:
    """Predict damaged window type from image bytes."""
    if device is None:
        device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        x = tf(img).unsqueeze(0).to(device)
        model = model.to(device)
        
        logits = model(x)[0]
        probs = torch.softmax(logits, dim=-1).cpu().numpy()
        pred_idx = int(probs.argmax())
        
        # Create reverse mapping from index to class name
        idx_to_class = {v: k for k, v in class_to_idx.items()}
        predicted_class = idx_to_class.get(pred_idx, f"class_{pred_idx}")
        
        # Get confidence score
        confidence = float(probs[pred_idx])
        
        # Create class probabilities dictionary
        class_probs = {class_name: float(probs[idx]) for class_name, idx in class_to_idx.items()}
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "pred_idx": pred_idx,
            "probs": probs.tolist(),
            "class_probs": class_probs,
            "damaged": True,  # All classes represent some type of damage
            "window_type": predicted_class.replace("damaged-", "").replace("-", " "),
        }
    except Exception as e:
        return {
            "error": f"Prediction failed: {str(e)}",
            "predicted_class": "unknown",
            "confidence": 0.0,
            "pred_idx": -1,
            "probs": [],
            "class_probs": {},
            "damaged": False,
            "window_type": "unknown"
        }


def predict_image_file(model_path: str, image_path: str, device: Optional[str] = None) -> Dict:
    """Convenience function to predict from image file path."""
    if not os.path.exists(model_path):
        return {
            "error": f"Model not found: {model_path}",
            "predicted_class": "unknown",
            "confidence": 0.0,
            "damaged": False,
        }
    
    if not os.path.exists(image_path):
        return {
            "error": f"Image not found: {image_path}",
            "predicted_class": "unknown", 
            "confidence": 0.0,
            "damaged": False,
        }
    
    try:
        model, tf, class_to_idx = load_checkpoint(model_path)
        
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        
        return predict_image_bytes(model, tf, image_bytes, class_to_idx, device)
    except Exception as e:
        return {
            "error": f"Failed to load model or predict: {str(e)}",
            "predicted_class": "unknown",
            "confidence": 0.0,
            "damaged": False,
        }


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Predict damaged window type from image")
    parser.add_argument("--model", type=str, default="models/damaged_windows.pt", help="Path to model checkpoint")
    parser.add_argument("--image", type=str, required=True, help="Path to input image")
    parser.add_argument("--device", type=str, default=None, help="Device to use (cuda/mps/cpu)")
    
    args = parser.parse_args()
    
    result = predict_image_file(args.model, args.image, args.device)
    
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(f"Image: {args.image}")
        print(f"Predicted class: {result['predicted_class']}")
        print(f"Window type: {result['window_type']}")
        print(f"Confidence: {result['confidence']:.4f}")
        print("\nClass probabilities:")
        for class_name, prob in result['class_probs'].items():
            print(f"  {class_name}: {prob:.4f}")
