
import os
import json
from PIL import Image, ImageDraw, ImageFont
from inference_sdk import InferenceHTTPClient

# Config
API_KEY = os.environ.get("ROBOFLOW_API_KEY", "OyljPWmncXkK6D0JviTD")
MODEL_ID = "dirt-detection-meter-vstbk/1"  # project/version
API_URL = os.environ.get("ROBOFLOW_API_URL", "https://classify.roboflow.com")  # classification endpoint

# Paths
ROOT = os.path.dirname(__file__)
IMG_PATH = os.path.join(ROOT, "image.png")
OUT_IMG = os.path.join(ROOT, "image_dirty_pred.jpg")
OUT_JSON = os.path.join(ROOT, "image_dirty_pred.json")

assert os.path.exists(IMG_PATH), f"Image not found: {IMG_PATH}"

# Client
client = InferenceHTTPClient(api_url=API_URL, api_key=API_KEY)

# Inference
result = client.infer(IMG_PATH, model_id=MODEL_ID)
with open(OUT_JSON, "w") as f:
    json.dump(result, f)

# Annotate image with top-1 label and confidence
img = Image.open(IMG_PATH).convert("RGB")
preds = result.get("predictions", [])
if preds:
    top = max(preds, key=lambda p: p.get("confidence", 0))
    label = top.get("class", "unknown")
    conf = top.get("confidence", 0)
    draw = ImageDraw.Draw(img)
    text = f"{label}: {conf:.2f}"
    # Simple text box
    padding = 6
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    tw, th = draw.textsize(text, font=font)
    draw.rectangle([0, 0, tw + 2 * padding, th + 2 * padding], fill=(0, 0, 0))
    draw.text((padding, padding), text, fill=(255, 255, 255), font=font)
img.save(OUT_IMG, quality=90)

print({
    "image": IMG_PATH,
    "json": OUT_JSON,
    "image_out": OUT_IMG,
})