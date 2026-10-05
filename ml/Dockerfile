FROM python:3.10-slim

WORKDIR /app

# System dependencies for MediaPipe and OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/videos /app/skeleton_videos /app/models

COPY requirements.txt .
# CPU-only torch first: mediapipe depends on torch, and the default wheel pulls in ~3 GB of CUDA libs
RUN pip install --no-cache-dir --timeout 120 --retries 10 torch opencv-contrib-python==4.9.0.80 --index-url https://download.pytorch.org/whl/cpu --extra-index-url https://pypi.org/simple \
    && pip install --no-cache-dir --timeout 120 --retries 10 -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
