#!/usr/bin/env python3
"""
Create a unified dataset combining normal windows (car_windows) and damaged windows.
The unified dataset will have 4 classes: normal, damaged-rear-window, damaged-window, damaged-windscreen
"""

import os
import shutil
import pandas as pd
from pathlib import Path

def create_unified_dataset():
    # Source directories
    car_windows_root = "datasets/car window"
    damaged_windows_root = "datasets/damaged_windows"
    
    # Target directory
    unified_root = "datasets/unified_windows"
    
    # Create target directories
    os.makedirs(f"{unified_root}/train", exist_ok=True)
    
    # Process training data
    print("Processing training data...")
    
    # 1. Copy normal windows from car_windows (all classes become "normal")
    car_train_dir = f"{car_windows_root}/train"
    car_csv_path = f"{car_train_dir}/_classes.csv"
    
    if os.path.exists(car_csv_path):
        car_df = pd.read_csv(car_csv_path)
        print(f"Found {len(car_df)} normal window samples")
        
        # Copy images and create records for normal windows
        normal_records = []
        copied_count = 0
        for _, row in car_df.iterrows():
            filename = row['filename']
            src_path = f"{car_train_dir}/{filename}"
            if os.path.exists(src_path):
                # Copy to unified dataset
                dst_path = f"{unified_root}/train/{filename}"
                shutil.copy2(src_path, dst_path)
                
                # Add record (all normal windows get label "normal")
                normal_records.append({
                    'filename': filename,
                    'normal': 1,
                    'damaged-rear-window': 0,
                    'damaged-window': 0,
                    'damaged-windscreen': 0
                })
                copied_count += 1
        
        print(f"Copied {copied_count} normal window images")
    
    # 2. Copy damaged windows from damaged_windows
    damaged_train_dir = f"{damaged_windows_root}/train"
    damaged_csv_path = f"{damaged_train_dir}/_classes.csv"
    
    damaged_records = []
    if os.path.exists(damaged_csv_path):
        damaged_df = pd.read_csv(damaged_csv_path)
        print(f"Found {len(damaged_df)} damaged window samples")
        
        # Copy images and preserve damage classification
        copied_count = 0
        for _, row in damaged_df.iterrows():
            filename = row['filename']
            src_path = f"{damaged_train_dir}/{filename}"
            if os.path.exists(src_path):
                # Copy to unified dataset
                dst_path = f"{unified_root}/train/{filename}"
                shutil.copy2(src_path, dst_path)
                
                # Add record (preserve original damage classification, set normal=0)
                damaged_records.append({
                    'filename': filename,
                    'normal': 0,
                    'damaged-rear-window': row.get('damaged-rear-window', 0),
                    'damaged-window': row.get('damaged-window', 0),
                    'damaged-windscreen': row.get('damaged-windscreen', 0)
                })
                copied_count += 1
        
        print(f"Copied {copied_count} damaged window images")
    
    # 3. Create unified CSV file
    all_records = normal_records + damaged_records
    unified_df = pd.DataFrame(all_records)
    
    # Save unified CSV
    unified_csv_path = f"{unified_root}/train/_classes.csv"
    unified_df.to_csv(unified_csv_path, index=False)
    
    print(f"Created unified dataset with {len(all_records)} total samples")
    print("Class distribution:")
    for col in ['normal', 'damaged-rear-window', 'damaged-window', 'damaged-windscreen']:
        count = unified_df[col].sum()
        print(f"  {col}: {count} samples")
    
    print(f"Unified dataset saved to: {unified_root}")
    print(f"CSV file: {unified_csv_path}")
    
    # Create README for the unified dataset
    readme_content = """# Unified Windows Dataset

This dataset combines normal windows and damaged windows for comprehensive window classification.

## Classes:
- normal: Normal/undamaged windows (from car_windows dataset)
- damaged-rear-window: Damaged rear windows
- damaged-window: Damaged side windows  
- damaged-windscreen: Damaged windscreens/front windows

## Structure:
- train/_classes.csv: Training data with one-hot encoded labels
- train/*.jpg: Training images

## Usage:
This dataset is designed to train a single model that can:
1. Detect if a window is normal or damaged
2. If damaged, classify the type of damage/window type
"""
    
    with open(f"{unified_root}/README.md", "w") as f:
        f.write(readme_content)
    
    return unified_root, len(all_records)

if __name__ == "__main__":
    unified_root, total_samples = create_unified_dataset()
    print(f"\nUnified dataset creation completed!")
    print(f"Location: {unified_root}")
    print(f"Total samples: {total_samples}")
