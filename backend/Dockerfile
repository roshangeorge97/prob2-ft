# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model during build
RUN python -c "from transformers import BlipProcessor, BlipForConditionalGeneration; \
    model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base'); \
    processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base')"

# Copy the application code
COPY . .

# Expose the port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]