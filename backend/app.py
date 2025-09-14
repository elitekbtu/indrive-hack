from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import os

from inference.inference_damage import load_checkpoint, predict_image_bytes
from inference.inference_dirty import predict_image_path
from inference.inference_rust_scratch import predict_image_path as predict_rust_scratch_image_path
from inference.inference_damage_parts import (
    load_checkpoint as load_damage_parts_ckpt,
    predict_image_bytes as predict_damage_parts_bytes,
)

device = "cuda" if torch.cuda.is_available() else "cpu"

app = FastAPI(title="Car Damage → Damaged/Intact", version="0.1")

# CORS for local frontend dev (Vite: http://localhost:5173, Next: http://localhost:3000)
_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://localhost"
    "http://127.0.0.1:80",
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

    # 2.5) If damaged, run rust/scratch classification (local)
    rust_scratch = None
    if is_damaged:
        try:
            ckpt_path_rs = os.path.join("models", "rust_scratch.pt")
            if os.path.exists(ckpt_path_rs):
                img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=90)
                buf.seek(0)
                tmp_path = os.path.join("/tmp", f"rustscratch_{os.getpid()}.jpg")
                with open(tmp_path, "wb") as f:
                    f.write(buf.getvalue())
                try:
                    rust_scratch = predict_rust_scratch_image_path(ckpt_path_rs, tmp_path)
                    # Normalize common typos in labels (e.g., 'dunt' -> 'dent')
                    if isinstance(rust_scratch, dict) and "pred_label" in rust_scratch:
                        lbl = str(rust_scratch.get("pred_label", ""))
                        if "dunt" in lbl.lower():
                            rust_scratch["raw_label"] = lbl
                            rust_scratch["pred_label"] = "dent"
                finally:
                    try:
                        os.remove(tmp_path)
                    except Exception:
                        pass
            else:
                rust_scratch = {"error": "Local checkpoint not found. Train with trains/train_rust_scratch.py first.", "expected": ckpt_path_rs}
        except Exception as e:
            rust_scratch = {"error": f"Rust/Scratch check failed: {str(e)}"}

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
        "rust_scratch": rust_scratch,
        "damage_parts_local": damage_parts_local,
        "dirty": dirty_result,
    }

@app.post("/rust_scratch_local")
async def rust_scratch_local(image: UploadFile = File(...)):
    ckpt_path = os.path.join("models", "rust_scratch.pt")
    if not os.path.exists(ckpt_path):
        return {"error": "Local checkpoint not found. Train with trains/train_rust_scratch.py first.", "expected": ckpt_path}
    image_bytes = await image.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    tmp_path = os.path.join("/tmp", f"rustscratch_{os.getpid()}.jpg")
    with open(tmp_path, "wb") as f:
        f.write(buf.getvalue())
    try:
        result = predict_rust_scratch_image_path(ckpt_path, tmp_path)
        # Normalize common typos (e.g., 'dunt' -> 'dent')
        if isinstance(result, dict) and "pred_label" in result:
            lbl = str(result.get("pred_label", ""))
            if "dunt" in lbl.lower():
                result["raw_label"] = lbl
                result["pred_label"] = "dent"
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    return result



