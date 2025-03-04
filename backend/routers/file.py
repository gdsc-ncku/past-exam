from typing import List

from fastapi import APIRouter, Cookie, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from crud.file import FileCRUD
from db.db import get_db
from schemas.common import ResponseModel
from schemas.file import FileCreate as FileCreateSchema
from schemas.file import FileResponse as FileResponseSchema
from services.auth import JWTService

router = APIRouter(tags=['file'], prefix='/api/v1/file')

file_crud = FileCRUD()
jwt_service = JWTService()


@router.get('', response_model=ResponseModel[List[FileResponseSchema]])
async def read_all_file(token: str | None = Cookie(default=None), db: Session = Depends(get_db)):
    user = jwt_service.verify_token(token)
    return file_crud.read_all_file(db, user['user_id'])


@router.post('', response_model=ResponseModel[FileResponseSchema])
async def create_file(
    upload_file: UploadFile = File(...),
    file_name: str = Form(...),
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    user = jwt_service.verify_token(token)
    file_data = FileCreateSchema(filename=file_name, user_id=user['user_id'])
    return await file_crud.create_file(db, file_data, upload_file)


@router.get('/{file_id}', response_model=ResponseModel[FileResponseSchema])
async def get_file(
    file_id: str, token: str | None = Cookie(default=None), db: Session = Depends(get_db)
):
    jwt_service.verify_token(token)
    return file_crud.get_file_by_id(db, file_id)


@router.delete('/{file_id}', response_model=ResponseModel[None])
async def delete_file(
    file_id: str, token: str | None = Cookie(default=None), db: Session = Depends(get_db)
):
    user = jwt_service.verify_token(token)
    return file_crud.delete_file(db, file_id, user['user_id'])
