# Multi-stage Docker build for FarmGuard Image Inference Service
# Optimized for PyTorch, YOLOv8, and efficient inference

# Base stage with Python and system dependencies
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    cmake \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgfortran5 \
    curl \
    wget \
    git \
    libopencv-dev \
    python3-opencv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Development stage - includes all dev dependencies
FROM base as development

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

# Copy application code
COPY . .

# Create directories
RUN mkdir -p /app/models /app/uploads /app/logs /tmp/uploads

# Set permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 8000

# Development command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage - optimized for smaller size and better performance
FROM base as production

# Install only production dependencies
COPY requirements.txt .

# Install Python dependencies with optimizations
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-dev -r requirements.txt && \
    pip cache purge

# Copy only necessary application files
COPY main.py .
COPY core/ ./core/
COPY models/ ./models/
COPY utils/ ./utils/

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Create necessary directories
RUN mkdir -p /app/models /app/uploads /app/logs /tmp/uploads && \
    chown -R appuser:appuser /app /tmp/uploads

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production command with optimizations
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--access-log", "--no-use-colors"]

# GPU-enabled production stage
FROM production as gpu

USER root

# Install CUDA dependencies (if needed)
RUN apt-get update && apt-get install -y \
    nvidia-cuda-toolkit \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch with CUDA support
RUN pip uninstall -y torch torchvision && \
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

USER appuser

# Default to production stage
FROM production