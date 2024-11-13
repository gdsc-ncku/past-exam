from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.file import File
from models.user import User
from schemas.common import ResponseModel
from schemas.file import FileCreate as FileCreateSchema
from schemas.file import FileResponse as FileResponseSchema


class FileCRUD:
    def create_file(self, db: Session, file: FileCreateSchema) -> ResponseModel[FileResponseSchema]:
        try:
            if file.uploader_id is not None:
                user = db.query(User).filter(User.userId == file.uploader_id).first()
                if not user:
                    raise HTTPException(
                        status_code=404, detail=f'User with id {file.uploader_id} not found'
                    )

            db_file = File(
                filename=file.filename,
                uploader_id=file.uploader_id,
                file_location=file.file_location,
            )
            db.add(db_file)
            db.commit()
            db.refresh(db_file)
            return ResponseModel(status='success', data=FileResponseSchema.model_validate(db_file))

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f'Failed to create file: {str(e)}')

    def read_all_file(self, db: Session) -> ResponseModel[List[FileResponseSchema]]:
        try:
            files = db.query(File).all()
            return ResponseModel(
                status='success', data=[FileResponseSchema.model_validate(file) for file in files]
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Failed to fetch files: {str(e)}')

    def get_file_by_id(self, db: Session, file_id: int) -> ResponseModel[FileResponseSchema]:
        file = db.query(File).filter(File.file_id == file_id).first()
        if not file:
            raise HTTPException(status_code=404, detail=f'File with id {file_id} not found')

        return ResponseModel(status='success', data=FileResponseSchema.model_validate(file))

    def delete_file(self, db: Session, file_id: int) -> ResponseModel[None]:
        try:
            self.get_file_by_id(db, file_id)
            file = db.query(File).filter(File.file_id == file_id).first()

            db.delete(file)
            db.commit()

            return ResponseModel(
                status='success', message=f'File with id {file_id} deleted successfully'
            )

        except HTTPException:
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f'Failed to delete file: {str(e)}')
