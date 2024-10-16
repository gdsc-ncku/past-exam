# FastAPI Backend Project

## Table of Contents

- [FastAPI Backend Project](#fastapi-backend-project)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [Development](#development)
    - [Linting and Formatting](#linting-and-formatting)
    - [Pre-commit Hooks](#pre-commit-hooks)

## Prerequisites

- Poetry [Installation Guide](https://python-poetry.org/docs/#installing-with-the-official-installer)
- Docker and Docker Compose

## Setup

1. Clone the repository:

2. Install dependencies using Poetry:
   ```
   poetry install
   ```

3. Copy `template.env` to `.env` and fill in the required environment variables:

4. Edit the `.env` file with your specific configuration:
   ```
   MINIO_ACCESS_KEY=your_minio_access_key
   MINIO_SECRET_KEY=your_minio_secret_key
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DB=your_database_name
   POSTGRES_IP=localhost
   POSTGRES_PORT=5432 
   MODE=dev
   ```

## Running the Application

1. Start the PostgreSQL database using Docker Compose: (Assume that docker compose is installed)

   ```docker-compose up -d```

2. Run the FastAPI application:
   ```
   poetry run python3 main.py
   ```

   The application will be available at `http://localhost:8000`.

3. Access the API documentation at `http://localhost:8000/docs`.

## API Endpoints

For detailed API documentation, refer to the Swagger UI at `/docs` when the application is running.

## Development

### Linting and Formatting

This project uses Ruff for linting and formatting. To run the linter:

```
ruff check
```

To format the code:

```
ruff format
```

### Pre-commit Hooks

The project is configured with pre-commit hooks to ensure code quality. Install the hooks:

```
poetry run pre-commit install
```