from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and processor
_model = None
_processor = None

def get_model():
    """Singleton pattern to load model only once"""
    global _model
    if _model is None:
        _model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    return _model

def get_processor():
    """Singleton pattern to load processor only once"""
    global _processor
    if _processor is None:
        _processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    return _processor

def process_image(image):
    processor = get_processor()
    if image.mode != 'RGB':
        image = image.convert('RGB')
    inputs = processor(image, return_tensors="pt")
    return inputs

@app.on_event("startup")
async def startup_event():
    """Pre-load model and processor"""
    print("Loading model and processor...")
    get_model()
    get_processor()
    print("Model and processor loaded!")

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        model = get_model()
        processor = get_processor()
        
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        inputs = process_image(image)
        outputs = model.generate(**inputs, max_length=50, num_beams=5)
        caption = processor.decode(outputs[0], skip_special_tokens=True)
        
        return {
            "description": caption,
            "confidence": 1.0 
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "error": str(e),
            "description": "An error occurred while processing the image."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)