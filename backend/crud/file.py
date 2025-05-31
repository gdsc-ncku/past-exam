import os
from typing import List, Optional

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
from services.cache import CacheService


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
        self, db: Session, file_data: FileCreateSchema, upload_file: UploadFile, cache: CacheService = None
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

                # Invalidate related caches
                if cache:
                    cache.invalidate_file_related_caches(
                        str(db_file.id), 
                        str(file_data.user_id), 
                        str(file_data.course_id)
                    )

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

    def read_all_file(self, db: Session, user_id: str, cache: CacheService = None) -> ResponseModel[List[FileResponseSchema]]:
        try:
            # Try to get from cache first
            if cache:
                cached_files = cache.get_user_files_cache(user_id)
                if cached_files:
                    return ResponseModel(
                        status=ResponseStatus.SUCCESS,
                        data=[FileResponseSchema.model_validate(File(**file_data)) for file_data in cached_files],
                    )

            files = db.query(File).filter(File.user_id == user_id).all()
            
            # Cache the result
            if cache:
                files_data = []
                for file in files:
                    file_dict = {
                        "file_id": file.file_id,
                        "filename": file.filename,
                        "file_location": file.file_location,
                        "user_id": str(file.user_id),
                        "course_id": str(file.course_id) if file.course_id else None,
                        "exam_type": file.exam_type,
                        "info": file.info,
                        "anonymous": file.anonymous,
                        "timestamp": file.timestamp.isoformat() if file.timestamp else None
                    }
                    files_data.append(file_dict)
                cache.set_user_files_cache(user_id, files_data)
            
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[FileResponseSchema.model_validate(file) for file in files],
            )

        except Exception:
            raise HTTPException(status_code=500, detail='Failed to fetch files.')

    def get_files_by_course(self, db: Session, course_id: str, cache: CacheService = None) -> ResponseModel[List[FileResponseSchema]]:
        try:
            # Validate course exists
            course = db.query(Course).filter(Course.course_id == course_id).first()
            if not course:
                raise HTTPException(status_code=404, detail=f'Course with id {course_id} not found')

            # Try to get from cache first
            if cache:
                cached_files = cache.get_course_files_cache(course_id)
                if cached_files:
                    return ResponseModel(
                        status=ResponseStatus.SUCCESS,
                        data=[FileResponseSchema.model_validate(File(**file_data)) for file_data in cached_files],
                    )

            files = db.query(File).filter(File.course_id == course_id).all()
            
            # Cache the result
            if cache:
                files_data = []
                for file in files:
                    file_dict = {
                        "file_id": file.file_id,
                        "filename": file.filename,
                        "file_location": file.file_location,
                        "user_id": str(file.user_id),
                        "course_id": str(file.course_id) if file.course_id else None,
                        "exam_type": file.exam_type,
                        "info": file.info,
                        "anonymous": file.anonymous,
                        "timestamp": file.timestamp.isoformat() if file.timestamp else None
                    }
                    files_data.append(file_dict)
                cache.set_course_files_cache(course_id, files_data)
            
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[FileResponseSchema.model_validate(file) for file in files],
            )

        except HTTPException:
            raise
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail='Failed to fetch files for course.')

    def get_file_by_id(self, db: Session, file_id: str, cache: CacheService = None) -> ResponseModel[FileResponseSchema]:
        try:
            # Try to get from cache first
            if cache:
                cached_file = cache.get_file_cache(file_id)
                if cached_file:
                    # Still need to generate fresh presigned URL for cached files
                    file_obj = File(**cached_file)
                    presigned_url = self.minio_service.get_presigned_url(
                        bucket_name=self.settings.minio_file_bucket,
                        object_name=file_obj.file_location,
                        expires=3600,
                    )
                    if presigned_url:
                        file_data = FileResponseSchema.model_validate(file_obj)
                        file_data.file_location = presigned_url
                        return ResponseModel(
                            status=ResponseStatus.SUCCESS,
                            data=file_data,
                        )

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

            # Cache the result (without the presigned URL)
            if cache:
                file_dict = {
                    "file_id": file.file_id,
                    "filename": file.filename,
                    "file_location": file.file_location,  # Store original path, not presigned URL
                    "user_id": str(file.user_id),
                    "course_id": str(file.course_id) if file.course_id else None,
                    "exam_type": file.exam_type,
                    "info": file.info,
                    "anonymous": file.anonymous,
                    "timestamp": file.timestamp.isoformat() if file.timestamp else None
                }
                cache.set_file_cache(file_id, file_dict)

            return ResponseModel(status=ResponseStatus.SUCCESS, data=file_data)

        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail='Failed to fetch file')

    def delete_file(self, db: Session, file_id: str, user_id: str, cache: CacheService = None) -> ResponseModel[None]:
        try:
            file = db.query(File).filter(File.file_id == file_id, File.user_id == user_id).first()
            if not file:
                raise HTTPException(status_code=404, detail=f'File with id {file_id} not found')

            # Delete file from MinIO storage
            try:
                self.minio_service.delete_file(
                    bucket_name=self.settings.minio_file_bucket, object_name=file.file_location
                )
            except Exception as e:
                print(e)
                raise HTTPException(status_code=500, detail='Failed to delete file from storage')

            # Delete file record from database
            db.delete(file)
            db.commit()

            # Invalidate related caches
            if cache:
                cache.invalidate_file_related_caches(file_id, str(user_id), str(file.course_id))

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                message='File deleted successfully',
                data=None,
            )

        except HTTPException:
            raise
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail='Failed to delete file.')
