# Use an official Python runtime as a parent image
FROM python:3.11.10

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy only requirements to cache them in docker layer
COPY pyproject.toml poetry.lock* /app/

# Project initialization:
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi --no-root

# Copy project
COPY . /app

EXPOSE 8000

# Run the application
CMD ["poetry", "run", "python3", "main.py"]
