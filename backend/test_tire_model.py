#!/usr/bin/env python3
"""
Script to test tire classification model with various images
"""
import os
import requests
import json
from pathlib import Path

def test_tire_classification(image_path, api_url="http://127.0.0.1:8000/tire_classification_local"):
    """Test tire classification with a specific image"""
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return None
    
    try:
        with open(image_path, 'rb') as f:
            files = {'image': (os.path.basename(image_path), f, 'image/jpeg')}
            response = requests.post(api_url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            predicted_class = result.get('predicted_class', 'unknown')
            confidence = result.get('confidence', 0.0)
            tire_condition = result.get('tire_condition', 'unknown')
            
            status_emoji = "✅" if tire_condition == "full" else "❌" if tire_condition == "flat" else "❓"
            
            print(f"{status_emoji} {os.path.basename(image_path)}")
            print(f"   Predicted: {predicted_class}")
            print(f"   Condition: {tire_condition}")
            print(f"   Confidence: {confidence:.4f}")
            print(f"   Class probs: {result.get('class_probs', {})}")
            print()
            
            return result
        else:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error testing {image_path}: {str(e)}")
        return None

def main():
    print("🔍 Testing Tire Classification Model")
    print("=" * 50)
    
    # Test with training samples
    train_dir = "datasets/full vs flat tire.v1i.multiclass/train"
    
    # Get some Full-tire samples
    print("Testing with Full-tire samples from training data:")
    full_tire_samples = [
        "00061_jpg.rf.4d760e26ffa294d89672c3e97c7b75d1.jpg",
        "00052_jpg.rf.eda98b435dd50e73ddb508db06ba9d3e.jpg",
        "00216_jpg.rf.1ca3a0a0563fa0d1264d4d63c8560e9a.jpg"
    ]
    
    for sample in full_tire_samples:
        image_path = os.path.join(train_dir, sample)
        test_tire_classification(image_path)
    
    print("-" * 50)
    print("Testing with Flat-tire samples from training data:")
    
    # Get some Flat-tire samples  
    flat_tire_samples = [
        "00122_jpg.rf.e6f9a4613521d61c55a1c42b3e26f9a6.jpg",
        "00181_jpg.rf.05734371323e67d04cb98b3a43ce9aff.jpg",
        "00136_jpg.rf.36e0b89a0691b95b381f8cc757f50f69.jpg"
    ]
    
    for sample in flat_tire_samples:
        image_path = os.path.join(train_dir, sample)
        test_tire_classification(image_path)
    
    print("-" * 50)
    print("Testing with user's image (if available):")
    
    # Test with user's image if it exists
    user_images = ["tirefull.jpg", "tire_test.jpg", "normal_tire.jpg"]
    for user_image in user_images:
        if os.path.exists(user_image):
            test_tire_classification(user_image)
    
    print("✅ Testing completed!")

if __name__ == "__main__":
    main()
