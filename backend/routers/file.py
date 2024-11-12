from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from crud.file import FileCRUD
from schemas.file import (
    FileCreate as FileCreateSchema,
    FileResponse as FileResponseSchema
)
from schemas.common import ResponseModel
from db.db import get_db

router = APIRouter(tags=['file'], prefix='/file')
file_crud = FileCRUD()


@router.get('', response_model=ResponseModel[List[FileResponseSchema]])
async def read_all_file(
    db: Session = Depends(get_db)
):
    return file_crud.read_all_file(db)

@router.post('', response_model=ResponseModel[FileResponseSchema])
async def create_file(
    file: FileCreateSchema,
    db: Session = Depends(get_db)
):
    return file_crud.create_file(db, file)

@router.get('/{file_id}', response_model=ResponseModel[FileResponseSchema])
async def get_file(
    file_id: int,
    db: Session = Depends(get_db)
):
    return file_crud.get_file_by_id(db, file_id)

@router.delete('/{file_id}', response_model=ResponseModel[None])
async def delete_file(
    file_id: int,
    db: Session = Depends(get_db)
):
    return file_crud.delete_file(db, file_id)
