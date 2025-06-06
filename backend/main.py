import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from db.db import init_db
from routers.comment import router as comment_router
from routers.course import router as course_router
from routers.file import router as file_router
from routers.user import router as user_router
from routers.bookmark import router as bookmark_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    lifespan=lifespan, docs_url='/api/docs', redoc_url='/api/redoc', openapi_url='/api/openapi.json'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, settings.frontend_api_url],  # Allows all origins
    allow_credentials=True,
    allow_methods=['*'],  # Allows all methods
    allow_headers=['*'],  # Allows all headers
)

app.include_router(user_router)
app.include_router(file_router)
app.include_router(comment_router)
app.include_router(course_router)
app.include_router(bookmark_router)

if __name__ == '__main__':
    uvicorn.run(
        'main:app',
        host='0.0.0.0',
        port=8000,
        reload=True if os.getenv('MODE') == 'dev' else False,
        log_level='info',
    )
