# 🚗 Car Condition Analysis - AI-Powered Vehicle Assessment System

## 🎯 **Multi-Model Computer Vision Solution**

Comprehensive car condition assessment using specialized PyTorch models for damage detection, cleanliness analysis, window condition evaluation, and tire classification.

![Project Banner](https://img.shields.io/badge/AI-Powered-brightgreen) ![Status](https://img.shields.io/badge/Status-Production%20Ready-success) ![Models](https://img.shields.io/badge/Models-7%20Specialized-blue)

---

## 🧠 **Machine Learning Architecture**

### **Specialized Model Pipeline**
Our solution employs **7 specialized PyTorch models** for comprehensive vehicle assessment:

1. **🔍 Binary Damage Detection** (`damage_binary.pt`)
   - **Architecture**: EfficientNet-B0 with ImageNet transfer learning
   - **Task**: Binary classification (damaged/intact)
   - **Training**: Cross-entropy loss with AdamW optimizer
   - **Data Augmentation**: Random flips, color jitter, normalization

2. **🎯 Damage Parts Localization** (`damage_parts.pt`)
   - **Architecture**: Multi-class EfficientNet-B0
   - **Task**: Specific car part damage identification
   - **Classes**: Bumpers, doors, fenders, body panels

3. **🧽 Vehicle Cleanliness Assessment** (`dirty_binary.pt`)
   - **Architecture**: EfficientNet-B0 with surface texture analysis
   - **Task**: Binary classification (clean/dirty)
   - **Optimization**: Specialized for various lighting conditions

4. **🪟 Window Damage Detection** (`damaged_windows.pt`)
   - **Architecture**: CNN optimized for glass surface analysis
   - **Task**: Window integrity assessment
   - **Features**: Crack, chip, and breakage detection

5. **🔄 Unified Window Analysis** (`unified_windows.pt`)
   - **Architecture**: Enhanced window condition classifier
   - **Task**: Comprehensive window state evaluation
   - **Dataset**: Combined window damage datasets

6. **⚡ Scratch & Dent Classification** (`scratch_dent.pt`)
   - **Architecture**: Multi-class CNN for surface damage types
   - **Task**: Damage type categorization (scratch, dent, rust)
   - **Training**: Specialized loss functions for imbalanced classes

7. **🛞 Tire Condition Analysis** (`tire_classification.pt`)
   - **Architecture**: ResNet/EfficientNet hybrid
   - **Task**: Tire condition assessment (full/flat/worn)
   - **Augmentation**: Advanced geometric transformations

### **🤖 LLM Integration**
**Azure OpenAI GPT-4** provides:
- **Technical Report Generation**: Human-readable analysis summaries
- **Stakeholder-Specific Insights**: Driver, passenger, and business perspectives
- **Condition Scoring**: Automated 0-100 rating system
- **Maintenance Recommendations**: Actionable improvement suggestions

---

## 🔬 **Training Methodology**

### **Transfer Learning Approach**
All models utilize **ImageNet pre-trained weights** for optimal performance:

```python
# EfficientNet-B0 with transfer learning
weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1
model = models.efficientnet_b0(weights=weights)
# Fine-tune classifier head
model.classifier[-1] = nn.Linear(in_features, num_classes)
```

### **Training Configuration**
- **Optimizer**: AdamW with weight decay (1e-4)
- **Learning Rate**: 3e-4 with Cosine Annealing scheduler
- **Batch Size**: 32 (optimized for GPU memory)
- **Image Size**: 224x224 (ImageNet standard)
- **Loss Function**: CrossEntropyLoss for classification tasks

### **Data Augmentation Pipeline**
```python
train_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=20),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.RandomPerspective(distortion_scale=0.2),
    transforms.GaussianBlur(kernel_size=3),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
])
```

---

## 🚀 **API Architecture**

### **Backend Stack**
```python
FastAPI + PyTorch + Azure OpenAI
├── 🔧 Core API (app.py)
│   ├── Model inference endpoints
│   ├── Comprehensive analysis pipeline
│   └── LLM report generation
├── 🧠 Inference Modules (/inference/)
│   ├── Individual model predictors
│   └── Preprocessing pipelines
└── 🐳 Docker containerization
```

### **Frontend Stack**
```typescript
React + TypeScript + TailwindCSS
├── 🎨 Modern UI with Radix components
├── 📱 Responsive design
├── 🔄 Multi-tab result display
└── 📊 Real-time condition scoring
```

### **API Endpoints**

#### **🎯 Comprehensive Analysis**
```http
POST /analyze-comprehensive
Content-Type: multipart/form-data

Response:
{
  "condition_score": 85,
  "technical_analysis": {
    "is_damaged": false,
    "damage_parts_local": null,
    "dirty": {"prediction": "clean", "confidence": 0.89}
  },
  "reports": {
    "driver": "...",
    "passenger": "...", 
    "business": "..."
  },
  "recommendations": [...]
}
```

#### **🔧 Individual Model Endpoints**
- `POST /damage_local` - Binary damage detection
- `POST /damage_parts_local` - Damaged parts identification  
- `POST /damaged_windows_local` - Window condition analysis
- `POST /unified_windows_local` - Enhanced window assessment
- `POST /dirty_local` - Vehicle cleanliness evaluation
- `POST /scratch_dent_local` - Surface damage classification
- `POST /tire_classification_local` - Tire condition analysis
- `GET /health` - System health check

---

## 🔧 **Quick Start**

### **Prerequisites**
- Docker & Docker Compose
- Python 3.8+ with PyTorch
- Azure OpenAI API access (optional for LLM features)

### **Environment Setup**
```bash
# 1. Clone repository
git clone https://github.com/elitekbtu/indrive-hack.git
cd indrive-hack

# 2. Configure environment
cd backend
cp example.env .env
# Add your Azure OpenAI credentials to .env

# 3. Launch with Docker
docker-compose up --build

# 4. Access application
# Frontend: http://localhost
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### **Local Development**
```bash
# Backend setup
cd backend
pip install -r requirements.txt
python app.py

# Frontend setup  
cd frontend
npm install
npm run dev
```

### **Environment Variables**
```env
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-instance.openai.azure.com/
AZURE_OPENAI_GPT4O_DEPLOYMENT_NAME=gpt-4o
```

---

## 📊 **Dataset & Training Details**

### **Datasets Used**
| Model | Dataset Source | Classes | Training Images |
|-------|---------------|---------|----------------|
| Damage Detection | Custom binary dataset | 2 (damaged/intact) | ~7,000 |
| Damage Parts | Multi-class car parts | 8 part categories | ~13,000 |
| Window Analysis | Combined window datasets | 3 window states | ~3,500 |
| Cleanliness | Custom clean/dirty | 2 (clean/dirty) | ~1,800 |
| Scratch & Dent | [Roboflow Dataset](https://universe.roboflow.com/carpro/car-scratch-and-dent) | 3 damage types | ~3,500 |
| Tire Classification | [Roboflow Dataset](https://universe.roboflow.com/yolov8-daldb/full-vs-flat-tire) | 2 tire states | ~1,200 |

### **Training Performance**
- **Training Time**: 2-10 epochs per model (early stopping)
- **Hardware**: GPU-accelerated training (CUDA/MPS support)
- **Validation Split**: 80/20 train/validation
- **Model Size**: ~20-50MB per model (EfficientNet-B0 base)

### **Model Deployment**
- **Inference Speed**: ~100-500ms per image
- **Memory Usage**: ~2GB GPU memory for all models
- **Batch Processing**: Supported for multiple images
- **Device Support**: CPU/CUDA/MPS (Apple Silicon)

---

## 🎯 **Project Structure**

### **Backend Organization**
```
backend/
├── app.py                 # FastAPI main application
├── models/               # Trained PyTorch models (.pt files)
├── inference/            # Model inference modules
├── trains/              # Training scripts for each model
├── services/            # LLM service integration
├── datasets/            # Training datasets
└── requirements.txt     # Python dependencies
```

### **Model Training Scripts**
Each model has dedicated training pipeline:
- `train_damage.py` - Binary damage detection
- `train_damage_parts.py` - Parts localization
- `train_damaged_windows.py` - Window analysis
- `train_unified_windows.py` - Enhanced window detection
- `train_dirty.py` - Cleanliness assessment
- `train_scratch_dent.py` - Surface damage classification
- `train_tire_classification.py` - Tire condition analysis

### **Inference Pipeline**
```python
# Example: Damage detection inference
from inference.inference_damage import load_checkpoint, predict_image_bytes

model, transforms, class_to_idx, damage_idx = load_checkpoint("models/damage_binary.pt")
result = predict_image_bytes(model, transforms, image_bytes, damage_idx)
```

---

## 🔧 **Technical Implementation Details**

### **Model Architecture Choices**
- **EfficientNet-B0**: Optimal balance of accuracy and inference speed
- **Transfer Learning**: Leverages ImageNet pre-trained features
- **Fine-tuning Strategy**: Only classifier head modified for domain adaptation
- **Multi-GPU Support**: Distributed training capabilities

### **Production Considerations**
- **Model Versioning**: Checkpoint-based model management
- **Error Handling**: Graceful degradation when models unavailable
- **Resource Management**: Memory-efficient inference pipeline
- **Scalability**: Containerized deployment with Docker

### **Performance Optimization**
- **Image Preprocessing**: Efficient tensor operations
- **Batch Inference**: Multiple image processing
- **Memory Management**: CUDA/MPS device optimization
- **Response Caching**: Reduced redundant computations

---

## 📊 **Dataset Attribution**

### **Roboflow Datasets**
- **Scratch & Dent**: [Car Scratch and Dent Dataset](https://universe.roboflow.com/carpro/car-scratch-and-dent) (CC BY 4.0)
- **Tire Classification**: [Full vs Flat Tire Dataset](https://universe.roboflow.com/yolov8-daldb/full-vs-flat-tire) (CC BY 4.0)
- **Window Damage**: Multiple combined window datasets

### **Custom Datasets**
- **Damage Detection**: Binary classification dataset (damaged/intact)
- **Cleanliness**: Clean vs dirty vehicle classification
- **Parts Localization**: Multi-class car part damage identification

---

## 🛠️ **Development & Deployment**

### **Local Development**
```bash
# Train individual models
cd backend
python trains/train_damage.py --epochs 10
python trains/train_tire_classification.py --epochs 5

# Run inference server
python app.py

# Frontend development
cd frontend
npm run dev
```

### **Docker Deployment**
```bash
# Build and run all services
docker-compose up --build

# Individual service builds
docker build -t car-analysis-backend ./backend
docker build -t car-analysis-frontend ./frontend
```

### **Model Management**
- **Training Checkpoints**: Automatic best model saving
- **Model Registry**: Version-controlled model storage
- **A/B Testing**: Compare model performance
- **Hot Swapping**: Update models without service restart

---

## 📞 **Project Information**

### **Technical Stack**
- **Backend**: FastAPI, PyTorch, Azure OpenAI
- **Frontend**: React, TypeScript, TailwindCSS
- **Infrastructure**: Docker, Docker Compose
- **ML Framework**: PyTorch with torchvision
- **Deployment**: Containerized microservices

### **Development Team**
**Team BUTAQ** - Multi-disciplinary AI/ML specialists
- Computer Vision model development
- Full-stack web application architecture  
- Cloud deployment and DevOps
- Business analysis and market research

---

*Comprehensive car condition analysis through specialized computer vision models and intelligent reporting*