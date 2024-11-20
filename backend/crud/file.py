import os
from typing import List
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from models.file import File
from models.user import User
from schemas.common import ResponseModel, ResponseStatus
from schemas.file import FileCreate as FileCreateSchema
from schemas.file import FileResponse as FileResponseSchema


class FileCRUD:
    UPLOAD_DIR = 'uploads'
    ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt'}
    MAX_FILE_SIZE = 10 * 1024 * 1024

    def _validate_file(self, upload_file: UploadFile):
        if upload_file.size > self.MAX_FILE_SIZE:
            max_size_mb = self.MAX_FILE_SIZE / 1024 / 1024
            raise HTTPException(
                status_code=400,
                detail=f'File size exceeds the maximum limit of {max_size_mb} MB.'
            )

        ext = os.path.splitext(upload_file.filename)[1].lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail='File extension not allowed.')

    async def create_file(
        self,
        db: Session,
        file_data: FileCreateSchema,
        upload_file: UploadFile
    ) -> ResponseModel[FileResponseSchema]:
        try:
            self._validate_file(upload_file)
            if file_data.uploader_id is not None:
                user = db.query(User).filter(User.user_id == file_data.uploader_id).first()
                if not user:
                    raise HTTPException(
                        status_code=404, detail=f'User with id {file_data.uploader_id} not found'
                    )
            
            os.makedirs(self.UPLOAD_DIR, exist_ok=True)

            file_extension = os.path.splitext(upload_file.filename)[1].lower()
            file_name = f'{uuid4()}{file_extension}'
            file_path = os.path.join(self.UPLOAD_DIR, file_name)

            try:
                content = await upload_file.read()
                with open(file_path, 'wb') as f:
                    f.write(content)
            except Exception:
                raise HTTPException(status_code=500, detail='Failed to save file.')

            db_file = File(
                filename=file_data.filename or upload_file.filename,
                uploader_id=file_data.uploader_id,
                file_location=file_path,
            )
            db.add(db_file)
            db.commit()
            db.refresh(db_file)

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=FileResponseSchema.model_validate(db_file)
            )

        except HTTPException:
            db.rollback()
            raise
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail='Failed to create file.')

    def read_all_file(self, db: Session) -> ResponseModel[List[FileResponseSchema]]:
        try:
            files = db.query(File).all()
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[FileResponseSchema.model_validate(file) for file in files]
            )

        except Exception:
            raise HTTPException(status_code=500, detail='Failed to fetch files.')

    def get_file_by_id(self, db: Session, file_id: int) -> ResponseModel[FileResponseSchema]:
        file = db.query(File).filter(File.file_id == file_id).first()
        if not file:
            raise HTTPException(status_code=404, detail=f'File with id {file_id} not found')

        return ResponseModel(
            status=ResponseStatus.SUCCESS,
            data=FileResponseSchema.model_validate(file)
        )

    def delete_file(self, db: Session, file_id: int) -> ResponseModel[None]:
        try:
            file = db.query(File).filter(File.file_id == file_id).first()
            if not file:
                raise HTTPException(status_code=404, detail=f'File with id {file_id} not found')

            if os.path.exists(file.file_location):
                try:
                    os.remove(file.file_location)
                except Exception:
                    raise HTTPException(status_code=500, detail='Failed to delete file.')

            db.delete(file)
            db.commit()

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                message=f'File with id {file_id} deleted successfully'
            )

        except HTTPException:
            db.rollback()
            raise
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail='Failed to delete file.')
