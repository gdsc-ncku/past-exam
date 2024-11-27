import os
from argparse import ArgumentParser
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from db.db import init_db
from routers.comment import router as comment_router
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
app.include_router(comment_router)

if __name__ == '__main__':
    parser = ArgumentParser(description='Run the FastAPI application')
    parser.add_argument(
        '--mode', type=str, default='dev', help='Specify the mode to run the application in'
    )
    args = parser.parse_args()

    os.environ['MODE'] = args.mode

    uvicorn.run(
        'main:app',
        host='localhost',
        port=8000,
        reload=True if args.mode == 'dev' else False,
        log_level='info',
    )
