from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import json

app = FastAPI()

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Configuration ---
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
NUM_CLASSES = 38  # Standard for PlantVillage dataset

# Initialize model architecture
model = models.resnet50(weights='IMAGENET1K_V1')
# Freeze weights
for param in model.parameters():
    param.requires_grad = False

# Replace head
model.fc = nn.Sequential(
    nn.Linear(model.fc.in_features, 512),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(512, NUM_CLASSES)
)

MODEL_STATUS = "Ready (Base Weights)"
model_path = 'best_model.pth'
if os.path.exists(model_path):
    try:
        model.load_state_dict(torch.load(model_path, map_location=DEVICE))
        MODEL_STATUS = "Ready (Trained Weights Loaded)"
    except Exception as e:
        MODEL_STATUS = f"Error Loading Weights: {str(e)}"
else:
    MODEL_STATUS = "Ready (Using Base Model - Low Accuracy for Specific Diseases)"

model = model.to(DEVICE)
model.eval()

# --- Data Transformation ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# --- Class Mapping (PlantVillage 38 Classes) ---
CLASSES = [
    "Apple Scab", "Apple Black Rot", "Cedar Apple Rust", "Apple Healthy",
    "Blueberry Healthy",
    "Cherry Powdery Mildew", "Cherry Healthy",
    "Corn Gray Leaf Spot", "Corn Common Rust", "Corn Northern Leaf Blight", "Corn Healthy",
    "Grape Black Rot", "Grape Black Measles", "Grape Leaf Blight", "Grape Healthy",
    "Orange Citrus Greening",
    "Peach Bacterial Spot", "Peach Healthy",
    "Pepper Bell Bacterial Spot", "Pepper Bell Healthy",
    "Potato Early Blight", "Potato Late Blight", "Potato Healthy",
    "Raspberry Healthy", "Soybean Healthy", "Squash Powdery Mildew",
    "Strawberry Leaf Scorch", "Strawberry Healthy",
    "Tomato Bacterial Spot", "Tomato Early Blight", "Tomato Late Blight", "Tomato Leaf Mold",
    "Tomato Septoria Leaf Spot", "Tomato Spider Mites", "Tomato Target Spot",
    "Tomato Yellow Leaf Curl Virus", "Tomato Mosaic Virus", "Tomato Healthy"
]

# Detailed Guidance Mapping
DISEASE_GUIDANCE = {
    "Blight": [
        "Improve air circulation around plants.",
        "Apply copper-based fungicides immediately.",
        "Avoid overhead irrigation to keep leaves dry.",
        "Remove and destroy infected plant debris."
    ],
    "Rust": [
        "Remove and burn infected leaves to stop spore spread.",
        "Apply sulfur-based fungicides as a preventative measure.",
        "Space plants correctly to reduce humidity.",
        "Check neighboring plants for early symptoms."
    ],
    "Scab": [
        "Rake and remove all fallen leaves in autumn.",
        "Prune to increase sunlight and air penetration.",
        "Apply fungicides during the early budding stage.",
        "Select disease-resistant varieties for future planting."
    ],
    "Spot": [
        "Avoid working with wet plants to prevent spreading bacteria.",
        "Use drip irrigation instead of sprinkler systems.",
        "Apply bactericides if symptoms appear early.",
        "Ensure proper weed control around the field."
    ],
    "Healthy": [
        "Maintain current watering and nutrition schedule.",
        "Continue monitoring for signs of pests or disease.",
        "Ensure soil health remains balanced.",
        "Keep the area free of weeds and debris."
    ]
}

@app.get("/")
async def root():
    return {
        "message": "Smart Krishi ML Inference Service",
        "status": "active",
        "model_status": MODEL_STATUS
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Security Compliance: Our system trusts nothing by default.
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Our system trusts nothing by default. Invalid file type.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        input_tensor = transform(image).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.nn.functional.softmax(output[0], dim=0)
            confidence, idx = torch.max(probs, 0)

        confidence_pct = confidence.item() * 100
        disease = CLASSES[idx.item()]

        # Generate guidance based on keywords in disease name
        guidance = DISEASE_GUIDANCE.get("Healthy", [])
        for key in DISEASE_GUIDANCE:
            if key in disease:
                guidance = DISEASE_GUIDANCE[key]
                break

        return {
            "status": "success",
            "prediction": disease,
            "confidence": round(confidence_pct, 2),
            "guidance": guidance,
            "model_intelligence": MODEL_STATUS,
            "security_header": "Our system trusts nothing by default."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
