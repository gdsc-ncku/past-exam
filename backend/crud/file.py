from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.user import User
from models.file import File
from schemas.file import (
    FileCreate as FileCreateSchema,
    FileResponse as FileResponseSchema
)
from schemas.common import ResponseModel


class FileCRUD:
    def create_file(self, db: Session, file: FileCreateSchema) -> ResponseModel[FileResponseSchema]:
        try:
            if file.uploader_id is not None:
                user = db.query(User).filter(User.userId == file.uploader_id).first()
                if not user:
                    raise HTTPException(
                        status_code=404,
                        detail=f"User with id {file.uploader_id} not found"
                    )

            db_file = File(
                filename=file.filename,
                uploader_id=file.uploader_id
            )
            db.add(db_file)
            db.commit()
            db.refresh(db_file)
            return ResponseModel(
                status='success',
                data=FileResponseSchema.from_orm(db_file)
            )

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create file: {str(e)}"
            )

    def read_all_file(self, db: Session) -> ResponseModel[List[FileResponseSchema]]:
        try:
            files = db.query(File).all()
            return ResponseModel(
                status='success',
                data=[FileResponseSchema.from_orm(file) for file in files]
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch files: {str(e)}"
            )

    def get_file_by_id(self, db: Session, file_id: int) -> ResponseModel[FileResponseSchema]:
        file = db.query(File).filter(File.file_id == file_id).first()
        if not file:
            raise HTTPException(
                status_code=404,
                detail=f"File with id {file_id} not found"
            )
        return ResponseModel(
            status='success',
            data=FileResponseSchema.from_orm(file)
        )
    
    def delete_file(self, db: Session, file_id: int) -> ResponseModel[None]:
        try:
            file = self.get_file_by_id(db, file_id)
            db.delete(file)
            db.commit()
            return ResponseModel(
                status='success',
                message=f"File with id {file_id} deleted successfully"
            )
        except HTTPException as e:
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete file: {str(e)}"
            )
