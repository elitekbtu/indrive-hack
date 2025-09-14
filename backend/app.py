from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import os

from inference.inference_damage import load_checkpoint, predict_image_bytes
from inference.inference_dirty import predict_image_path
from inference.inference_damage_parts import (
    load_checkpoint as load_damage_parts_ckpt,
    predict_image_bytes as predict_damage_parts_bytes,
)
from inference.inference_damaged_windows import (
    load_checkpoint as load_damaged_windows_ckpt,
    predict_image_bytes as predict_damaged_windows_bytes,
)
from inference.inference_unified_windows import (
    load_checkpoint as load_unified_windows_ckpt,
    predict_image_bytes as predict_unified_windows_bytes,
)
from inference.inference_scratch_dent import (
    load_checkpoint as load_scratch_dent_ckpt,
    predict_image_bytes as predict_scratch_dent_bytes,
)
from inference.inference_tire_classification import (
    load_checkpoint as load_tire_classification_ckpt,
    predict_image_bytes as predict_tire_classification_bytes,
)
from services.llm_service import llm_service

device = "cuda" if torch.cuda.is_available() else "cpu"

app = FastAPI(title="Car Damage → Damaged/Intact", version="0.1")

# CORS for local frontend dev (Vite: http://localhost:5173, Next: http://localhost:3000)
_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://localhost",
    "http://127.0.0.1:80",
    "http://34.133.26.155",
    "34.133.26.155",
    "http://34.133.26.155:8080",
    "http://34.133.26.155:80",
    "http://34.133.26.155",

    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "device": device}

@app.get("/analyze")
def analyze_info():
    # Lightweight readiness/info endpoint for the frontend
    return {"ok": True, "endpoint": "analyze", "method": "POST expected with form 'image'"}


# Removed Hugging Face /damage endpoint


@app.post("/damage_local")
async def damage_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "damage_binary.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with train_damage.py first.", "expected": ckpt_path}
    model_local, tf, class_to_idx, damage_index = load_checkpoint(ckpt_path)
    image_bytes = await image.read()
    result = predict_image_bytes(model_local, tf, image_bytes, damage_index)
    return result


# New endpoint: run damage parts classifier directly
@app.post("/damage_parts_local")
async def damage_parts_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "damage_parts.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_damage_parts.py first.", "expected": ckpt_path}
    image_bytes = await image.read()
    model_p, tf_p, idx_to_class_p = load_damage_parts_ckpt(ckpt_path)
    out = predict_damage_parts_bytes(model_p, tf_p, image_bytes)
    pred_idx = int(out.get("pred_idx", -1))
    out["pred_label"] = idx_to_class_p.get(pred_idx, str(pred_idx))
    return out

@app.post("/damaged_windows_local")
async def damaged_windows_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "damaged_windows.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_damaged_windows.py first.", "expected": ckpt_path}
    image_bytes = await image.read()
    model_w, tf_w, class_to_idx_w = load_damaged_windows_ckpt(ckpt_path)
    result = predict_damaged_windows_bytes(model_w, tf_w, image_bytes, class_to_idx_w)
    return result

@app.post("/dirty_local")
async def dirty_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "dirty_binary.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with train_dirty.py first.", "expected": ckpt_path}
    # Save uploaded image to a temporary file for convenience
    image_bytes = await image.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    tmp_path = os.path.join("/tmp", f"dirty_{os.getpid()}.jpg")
    with open(tmp_path, "wb") as f:
        f.write(buf.getvalue())
    try:
        result = predict_image_path(ckpt_path, tmp_path)
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    return result


@app.post("/damaged_windows_local")
async def damaged_windows_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "damaged_windows.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_damaged_windows.py first.", "expected": ckpt_path}
    
    image_bytes = await image.read()
    try:
        model_w, tf_w, class_to_idx_w = load_damaged_windows_ckpt(ckpt_path)
        result = predict_damaged_windows_bytes(model_w, tf_w, image_bytes, class_to_idx_w)
        return result
    except Exception as e:
        return {"error": f"Damaged windows prediction failed: {str(e)}"}


@app.post("/unified_windows_local")
async def unified_windows_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "unified_windows.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_unified_windows.py first.", "expected": ckpt_path}
    
    image_bytes = await image.read()
    try:
        model_uw, tf_uw, class_to_idx_uw = load_unified_windows_ckpt(ckpt_path)
        result = predict_unified_windows_bytes(model_uw, tf_uw, image_bytes, class_to_idx_uw)
        return result
    except Exception as e:
        return {"error": f"Unified windows prediction failed: {str(e)}"}


@app.post("/scratch_dent_local")
async def scratch_dent_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "scratch_dent.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_scratch_dent.py first.", "expected": ckpt_path}
    
    image_bytes = await image.read()
    try:
        model_sd, tf_sd, class_to_idx_sd = load_scratch_dent_ckpt(ckpt_path)
        result = predict_scratch_dent_bytes(model_sd, tf_sd, image_bytes, class_to_idx_sd)
        return result
    except Exception as e:
        return {"error": f"Scratch-dent prediction failed: {str(e)}"}


@app.post("/tire_classification_local")
async def tire_classification_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "tire_classification.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_tire_classification.py first.", "expected": ckpt_path}
    
    image_bytes = await image.read()
    try:
        model_tc, tf_tc, class_to_idx_tc = load_tire_classification_ckpt(ckpt_path)
        result = predict_tire_classification_bytes(model_tc, tf_tc, image_bytes, class_to_idx_tc)
        return result
    except Exception as e:
        return {"error": f"Tire classification prediction failed: {str(e)}"}


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    image_bytes = await image.read()

    # 1) is_damaged: prefer local binary model; fallback to HF classifier threshold
    is_damaged = None
    damage_source = None
    damage_local_result = None

    try:
        ckpt_path_damage = os.path.join("models", "damage_binary.pt")
        if os.path.exists(ckpt_path_damage):
            model_local, tf, class_to_idx, damage_index = load_checkpoint(ckpt_path_damage)
            damage_local_result = predict_image_bytes(model_local, tf, image_bytes, damage_index)
            if isinstance(damage_local_result, dict) and "damaged" in damage_local_result:
                is_damaged = bool(damage_local_result["damaged"])
                damage_source = "local"
    except Exception:
        pass

    # Hugging Face inference removed; if no local damage model, is_damaged stays None

    # 2.5) Rust/scratch classification removed

    # 2.6) If damaged, run parts-level multiclass classifier (same as /damage_parts_local)
    damage_parts_local = None
    if is_damaged:
        try:
            ckpt_path_parts = os.path.join("models", "damage_parts.pt")
            if os.path.exists(ckpt_path_parts):
                model_p, tf_p, idx_to_class_p = load_damage_parts_ckpt(ckpt_path_parts)
                parts = predict_damage_parts_bytes(model_p, tf_p, image_bytes)
                # map index to label for convenience
                pred_idx = int(parts.get("pred_idx", -1))
                parts["pred_label"] = idx_to_class_p.get(pred_idx, str(pred_idx))
                damage_parts_local = parts
            else:
                damage_parts_local = {"error": "Local checkpoint not found. Train with trains/train_damage_parts.py first.", "expected": ckpt_path_parts}
        except Exception as e:
            damage_parts_local = {"error": f"Parts classifier failed: {str(e)}"}

    # 3) Dirtiness check (local) — skip if damaged
    dirty_result = None
    if not is_damaged:
        try:
            ckpt_path_dirty = os.path.join("models", "dirty_binary.pt")
            if os.path.exists(ckpt_path_dirty):
                img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=90)
                buf.seek(0)
                tmp_path = os.path.join("/tmp", f"dirty_{os.getpid()}.jpg")
                with open(tmp_path, "wb") as f:
                    f.write(buf.getvalue())
                try:
                    dirty_result = predict_image_path(ckpt_path_dirty, tmp_path)
                finally:
                    try:
                        os.remove(tmp_path)
                    except Exception:
                        pass
            else:
                dirty_result = {"error": "Local checkpoint not found. Train with train_dirty.py first.", "expected": ckpt_path_dirty}
        except Exception as e:
            dirty_result = {"error": f"Dirty check failed: {str(e)}"}


    return {
        "is_damaged": bool(is_damaged),
        "damage_source": damage_source,
        "damage_local": damage_local_result,
        "damage_parts_local": damage_parts_local,
        "dirty": dirty_result,
    }


@app.post("/analyze-comprehensive")
async def analyze_comprehensive(image: UploadFile = File(...), output_type: str = "structured"):
    """
    Comprehensive car analysis with LLM-generated reports for different stakeholders
    
    Args:
        output_type: "structured" for detailed reports or "raw" for technical data only
    """
    # Get technical analysis first
    technical_analysis = await analyze(image)
    
    if output_type == "raw":
        # Return raw technical analysis without LLM processing
        return {
            "technical_analysis": technical_analysis,
            "condition_score": 85,  # Default score for raw analysis
            "reports": {
                "driver": "Raw technical analysis - see technical_analysis for details",
                "passenger": "Raw technical analysis - see technical_analysis for details", 
                "business": "Raw technical analysis - see technical_analysis for details"
            },
            "recommendations": [],
            "metadata": {
                "analysis_timestamp": "2025-09-14",
                "model_version": "v1.0",
                "output_type": "raw",
                "confidence_threshold": 0.5
            }
        }
    else:
        # Generate comprehensive reports using LLM (structured output)
        llm_reports = llm_service.generate_comprehensive_report(technical_analysis)
        
        return {
            "technical_analysis": technical_analysis,
            "condition_score": llm_reports.get("condition_score", 0),
            "reports": {
                "driver": llm_reports.get("driver_report", ""),
                "passenger": llm_reports.get("passenger_report", ""), 
                "business": llm_reports.get("business_report", "")
            },
            "recommendations": llm_reports.get("recommendations", []),
            "metadata": {
                "analysis_timestamp": "2025-09-14",
                "model_version": "v1.0",
                "output_type": "structured",
                "confidence_threshold": 0.5
            }
        }



