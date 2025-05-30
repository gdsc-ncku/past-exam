import os
from typing import List

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from core.config import get_settings
from models.file import File
from models.user import User
from models.course import Course
from schemas.common import ResponseModel, ResponseStatus
from schemas.file import FileCreate as FileCreateSchema
from schemas.file import FileResponse as FileResponseSchema
from services.minio import MinioService


class FileCRUD:
    def __init__(self):
        self.minio_service = MinioService()
        self.settings = get_settings()

    UPLOAD_DIR = 'uploads'
    ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt'}
    MAX_FILE_SIZE = 10 * 1024 * 1024

    def _validate_file(self, upload_file: UploadFile):
        if upload_file.size > self.MAX_FILE_SIZE:
            max_size_mb = self.MAX_FILE_SIZE / 1024 / 1024
            raise HTTPException(
                status_code=400, detail=f'File size exceeds the maximum limit of {max_size_mb} MB.'
            )

        ext = os.path.splitext(upload_file.filename)[1].lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail='File extension not allowed.')

    async def create_file(
        self, db: Session, file_data: FileCreateSchema, upload_file: UploadFile
    ) -> ResponseModel[FileResponseSchema]:
        try:
            self._validate_file(upload_file)
            user = db.query(User).filter(User.user_id == file_data.user_id).first()
            if not user:
                raise HTTPException(
                    status_code=404, detail=f'User with id ${file_data.user_id} not found.'
                )

            # Validate course exists if course_id is provided
            if file_data.course_id:
                course = db.query(Course).filter(Course.course_id == file_data.course_id).first()
                if not course:
                    raise HTTPException(
                        status_code=404, detail=f'Course with id {file_data.course_id} not found.'
                    )

            try:
                content = await upload_file.read()
                file_url = self.minio_service.upload_file(
                    bucket_name=self.settings.minio_file_bucket,
                    user_id=file_data.user_id,
                    file_name=None,
                    data=content,
                )
            except Exception as e:
                print(e)
                raise HTTPException(status_code=500, detail='Failed to save file.')

            try:
                # The file_url format is: /bucket_name/user_id/file_id
                # We need to store user_id/file_id as the object name
                url_parts = file_url.strip('/').split('/')
                object_name = '/'.join(url_parts[1:])  # Skip bucket name, keep user_id/file_id
                
                db_file = File(
                    filename=file_data.filename,
                    file_location=object_name,
                    user_id=file_data.user_id,
                    file_id=file_url.split('/')[-1],
                    course_id=file_data.course_id,
                    exam_type=file_data.exam_type,
                    info=file_data.info,
                    anonymous=file_data.anonymous,
                )

                db.add(db_file)
                db.commit()
                db.refresh(db_file)

                return ResponseModel(
                    status=ResponseStatus.SUCCESS,
                    message='File uploaded successfully',
                    data=db_file,
                )

            except Exception as e:
                print(e)
                raise HTTPException(status_code=500, detail='Failed to create file record')

        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=500, detail='Failed to process file upload')

    def read_all_file(self, db: Session, user_id: str) -> ResponseModel[List[FileResponseSchema]]:
        try:
            files = db.query(File).filter(File.user_id == user_id).all()
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[FileResponseSchema.model_validate(file) for file in files],
            )

        except Exception:
            raise HTTPException(status_code=500, detail='Failed to fetch files.')

    def get_files_by_course(self, db: Session, course_id: str) -> ResponseModel[List[FileResponseSchema]]:
        try:
            # Validate course exists
            course = db.query(Course).filter(Course.course_id == course_id).first()
            if not course:
                raise HTTPException(status_code=404, detail=f'Course with id {course_id} not found')

            files = db.query(File).filter(File.course_id == course_id).all()
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[FileResponseSchema.model_validate(file) for file in files],
            )

        except HTTPException:
            raise
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail='Failed to fetch files for course.')

    def get_file_by_id(self, db: Session, file_id: str) -> ResponseModel[FileResponseSchema]:
        file = db.query(File).filter(File.file_id == file_id).first()
        if not file:
            raise HTTPException(status_code=404, detail=f'File with id {file_id} not found')

        # Generate a temporary presigned URL that expires
        presigned_url = self.minio_service.get_presigned_url(
            bucket_name=self.settings.minio_file_bucket,
            object_name=file.file_location,
            expires=3600,  # URL expires in 1 hour
        )
        
        if not presigned_url:
            print(f"Failed to generate presigned URL for file {file_id}, bucket: {self.settings.minio_file_bucket}, object: {file.file_location}")
            raise HTTPException(status_code=500, detail='Failed to generate file access URL')

        # Create a copy of the file data with the temporary URL
        file_data = FileResponseSchema.model_validate(file)
        file_data.file_location = presigned_url

        return ResponseModel(status=ResponseStatus.SUCCESS, data=file_data)

    def delete_file(self, db: Session, file_id: str, user_id: str) -> ResponseModel[None]:
        try:
            file = db.query(File).filter(File.file_id == file_id, File.user_id == user_id).first()
            if not file:
                raise HTTPException(status_code=404, detail=f'File with id {file_id} not found')

            self.minio_service.delete_file(
                bucket_name=self.settings.minio_file_bucket, object_name=file.file_location
            )
            db.delete(file)
            db.commit()
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                message=f'File with id {file_id} deleted successfully',
            )

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            print(e)
            raise HTTPException(status_code=500, detail='Failed to delete file.')
