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

# Initialize BLIP model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")


def process_image(image):
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Process image for BLIP
    inputs = processor(image, return_tensors="pt")
    
    return inputs

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Read and process the image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Process image
        inputs = process_image(image)
        
        # Generate caption
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