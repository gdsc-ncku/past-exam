from typing import List

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from crud.file import FileCRUD
from db.db import get_db
from schemas.common import ResponseModel
from schemas.file import FileCreate as FileCreateSchema
from schemas.file import FileResponse as FileResponseSchema

router = APIRouter(tags=['file'], prefix='/file')
file_crud = FileCRUD()


@router.get('', response_model=ResponseModel[List[FileResponseSchema]])
async def read_all_file(db: Session = Depends(get_db)):
    return file_crud.read_all_file(db)


@router.post('', response_model=ResponseModel[FileResponseSchema])
async def create_file(
    upload_file: UploadFile = File(...),
    file_name: str = Form(None),
    uploader_id: int = Form(None),
    db: Session = Depends(get_db)
):
    file_data = FileCreateSchema(
        filename=file_name or upload_file.filename,
        uploader_id=uploader_id
    )
    return await file_crud.create_file(db, file_data, upload_file)


@router.get('/{file_id}', response_model=ResponseModel[FileResponseSchema])
async def get_file(file_id: int, db: Session = Depends(get_db)):
    return file_crud.get_file_by_id(db, file_id)


@router.delete('/{file_id}', response_model=ResponseModel[None])
async def delete_file(file_id: int, db: Session = Depends(get_db)):
    return file_crud.delete_file(db, file_id)
