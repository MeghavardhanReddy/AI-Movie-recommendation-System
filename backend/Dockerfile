# Use official lightweight Python image
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies needed for compiling python packages (e.g. scikit-surprise, psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt to leverage Docker layer caching
COPY backend/requirements.txt /app/backend/

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy application directories (necessary for non-volume runs/production)
COPY backend /app/backend
COPY datasets /app/datasets
COPY ml-engine /app/ml-engine

# Set working directory to the backend Django project root
WORKDIR /app/backend

# Expose Django default port
EXPOSE 8000

# Default command to run the development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
