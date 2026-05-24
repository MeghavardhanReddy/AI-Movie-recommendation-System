# =========================
# BASE IMAGE
# =========================

FROM python:3.11-slim

# =========================
# ENV VARIABLES
# =========================

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# =========================
# SYSTEM DEPENDENCIES
# =========================

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# =========================
# WORK DIRECTORY
# =========================

WORKDIR /app

# =========================
# COPY REQUIREMENTS
# =========================

COPY backend/requirements.txt /app/backend/

# =========================
# INSTALL PYTHON PACKAGES
# =========================

RUN pip install --upgrade pip

RUN pip install --no-cache-dir \
    -r /app/backend/requirements.txt

# =========================
# COPY PROJECT FILES
# =========================

COPY backend /app/backend
COPY datasets /app/datasets
COPY ml-engine /app/ml-engine

# =========================
# DJANGO WORKDIR
# =========================

WORKDIR /app/backend

# =========================
# STATIC FILES
# =========================

RUN python manage.py collectstatic --noinput || true

# =========================
# EXPOSE PORT
# =========================

EXPOSE 8000

# =========================
# START SERVER
# =========================

CMD gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120