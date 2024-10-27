from fastapi import APIRouter

from crud.file import FileCRUD
from schemas.file import File as FileSchema

router = APIRouter(tags=['file'], prefix='/file')


@router.get('')
async def read_all_file():
    return FileCRUD.read_all_file()


@router.post('')
async def create_file(file: FileSchema):
    return FileCRUD.create_file(file)
