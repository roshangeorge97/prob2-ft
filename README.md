# Freight Tiger Problem 2

Hey there! This is my solution for Problem 2, where I built an app that can describe images. 

## Check it out live!
👉 [Try the app here](https://prob2-ft-hev1.vercel.app/)

Quick heads up - the backend runs on a free tier and uses a pretty beefy AI model (BLIP - it's like 990MB!). So when you first try it, it might take around 7 mins to get your results. I know it's a bit slow, but I picked BLIP because it gives really detailed and accurate descriptions of images.

## What's cool about it?
- Upload any image and get a natural description  
- See a preview before analyzing
- Nice clean interface
- Shows you when it's thinking

## Built with
### Frontend stuff:
- React + TypeScript (used SWC because it's super fast)
- Tailwind CSS for styling  
- Those neat shadcn/ui components

### Backend stuff:
- FastAPI
- PyTorch 
- Hugging Face's BLIP model
- Docker for deployment

## Want to run it locally?

### Backend setup
1. Get your virtual environment going:
   
   ```bash
   python -m venv venv

   # On Windows, use:

   .\venv\Scripts\activate

   # On Mac/Linux, use:

   source venv/bin/activate
   ```
   
2. Install what you need:

    ```bash
    pip install -r requirements.txt
    ```

3. Fire it up:

    ```bash
    python main.py
    ```

You'll find it running at http://localhost:8000.

### Frontend setup

1. Get the dependencies:
    ```bash
    npm install
    ```
    
2. Start it up:
    ```
    npm run dev
    ```

This will be at http://localhost:5173.

## How I deployed it

### Backend
I used Docker to package everything up and deployed it on Render. Here's my `Dockerfile` if you're curious:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend
Just pushed it to Vercel - super straightforward with these settings:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### About that AI model
I'm using BLIP (it's from Salesforce) - specifically the `blip-image-captioning-base` version. It's a beast at understanding images and writing natural descriptions. But yeah, it's pretty big at 990MB, which is why it takes a while to warm up on the free tier.
