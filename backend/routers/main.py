from fastapi import APIRouter

from crud.main import get_env_info, health

router = APIRouter(tags=['basic'], prefix='/api/v1')


@router.get('/info')
async def _():
    return get_env_info()


@router.get('/health')
async def _():
    return health()
