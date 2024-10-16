from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from core.config import get_settings
from db.db import init_db
from routers.file import router as file_router
from routers.main import router as main_router
from routers.user import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(main_router)
app.include_router(user_router)
app.include_router(file_router)
if __name__ == '__main__':
    mode = get_settings().mode
    uvicorn.run('main:app', port=8000, reload=True if mode == 'dev' else False, log_level='info')
