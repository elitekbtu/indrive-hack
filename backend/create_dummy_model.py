#!/usr/bin/env python3
"""
Create a dummy model for damaged windows classification for demo purposes
"""
import torch
import torch.nn as nn
import os

def create_dummy_model():
    """Create a simple dummy model that can classify damaged windows"""
    
    # Simple CNN model
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
        nn.Linear(128, 3)  # 3 classes
    )
    
    # Initialize with random weights (this will give random but consistent predictions)
    torch.manual_seed(42)
    for module in model.modules():
        if isinstance(module, (nn.Conv2d, nn.Linear)):
            nn.init.xavier_uniform_(module.weight)
            if module.bias is not None:
                nn.init.zeros_(module.bias)
    
    return model

def main():
    print("Creating dummy damaged windows model...")
    
    # Create model
    model = create_dummy_model()
    
    # Define class mapping
    class_to_idx = {
        'damaged-rear-window': 0,
        'damaged-window': 1,
        'damaged-windscreen': 2
    }
    
    # Create checkpoint data
    checkpoint = {
        'model_state_dict': model.state_dict(),
        'class_to_idx': class_to_idx,
        'arch': 'simple',
        'image_size': 224,
        'best_val_acc': 0.85,  # Fake accuracy for demo
        'num_classes': 3,
    }
    
    # Save model
    os.makedirs('models', exist_ok=True)
    model_path = 'models/damaged_windows.pt'
    torch.save(checkpoint, model_path)
    
    print(f"✅ Dummy model saved to: {model_path}")
    print(f"Classes: {list(class_to_idx.keys())}")
    print("🎯 This is a demo model with random predictions!")
    print("   Use it to test the interface while training a real model.")

if __name__ == "__main__":
    main()
