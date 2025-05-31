from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_

from models.file import File
from models.user import User
from schemas.common import ResponseModel, ResponseStatus
from schemas.file import FileResponse as FileResponseSchema
from services.auth import JWTService
from services.cache import CacheService


class BookmarkCRUD:
    def __init__(self):
        self.jwt_service = JWTService()

    def add_bookmark(self, db: Session, token: str, file_id: str, cache: CacheService = None) -> ResponseModel[None]:
        """Add a file to user's bookmarks"""
        try:
            # Verify user token
            user_data = self.jwt_service.verify_token(token)
            user_id = user_data['user_id']
            
            # Get user and file
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail='User not found')
            
            file = db.query(File).filter(File.file_id == file_id).first()
            if not file:
                raise HTTPException(status_code=404, detail='File not found')
            
            # Check if file is already bookmarked
            if file in user.bookmarked_files:
                raise HTTPException(status_code=400, detail='File is already bookmarked')
            
            # Add file to bookmarks
            user.bookmarked_files.append(file)
            db.commit()
            
            # Invalidate cache
            if cache:
                cache.delete_user_bookmarks_cache(user_id)
            
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                message='File bookmarked successfully'
            )
            
        except HTTPException:
            raise
        except Exception as e:
            db.rollback()
            print(f"Error adding bookmark: {e}")
            raise HTTPException(status_code=500, detail='Failed to add bookmark')

    def remove_bookmark(self, db: Session, token: str, file_id: str, cache: CacheService = None) -> ResponseModel[None]:
        """Remove a file from user's bookmarks"""
        try:
            # Verify user token
            user_data = self.jwt_service.verify_token(token)
            user_id = user_data['user_id']
            
            # Get user and file
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail='User not found')
            
            file = db.query(File).filter(File.file_id == file_id).first()
            if not file:
                raise HTTPException(status_code=404, detail='File not found')
            
            # Check if file is bookmarked
            if file not in user.bookmarked_files:
                raise HTTPException(status_code=400, detail='File is not bookmarked')
            
            # Remove file from bookmarks
            user.bookmarked_files.remove(file)
            db.commit()
            
            # Invalidate cache
            if cache:
                cache.delete_user_bookmarks_cache(user_id)
            
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                message='Bookmark removed successfully'
            )
            
        except HTTPException:
            raise
        except Exception as e:
            db.rollback()
            print(f"Error removing bookmark: {e}")
            raise HTTPException(status_code=500, detail='Failed to remove bookmark')

    def get_bookmarks(self, db: Session, token: str, cache: CacheService = None) -> ResponseModel[List[FileResponseSchema]]:
        """Get all bookmarked files for the current user"""
        try:
            # Verify user token
            user_data = self.jwt_service.verify_token(token)
            user_id = user_data['user_id']
            
            # Try to get from cache first
            if cache:
                cached_bookmarks = cache.get_user_bookmarks_cache(user_id)
                if cached_bookmarks:
                    return ResponseModel(
                        status=ResponseStatus.SUCCESS,
                        data=[FileResponseSchema(**bookmark) for bookmark in cached_bookmarks],
                        message=f'Found {len(cached_bookmarks)} bookmarked files'
                    )
            
            # Get user with bookmarked files
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail='User not found')
            
            # Cache the result
            if cache:
                bookmarks_data = []
                for file in user.bookmarked_files:
                    bookmark_dict = {
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
                    bookmarks_data.append(bookmark_dict)
                cache.set_user_bookmarks_cache(user_id, bookmarks_data)
            
            # Convert to response schema
            bookmarked_files = [
                FileResponseSchema.model_validate(file) 
                for file in user.bookmarked_files
            ]
            
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=bookmarked_files,
                message=f'Found {len(bookmarked_files)} bookmarked files'
            )
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error getting bookmarks: {e}")
            raise HTTPException(status_code=500, detail='Failed to get bookmarks')

    def check_bookmark_status(self, db: Session, token: str, file_id: str, cache: CacheService = None) -> ResponseModel[dict]:
        """Check if a file is bookmarked by the current user"""
        try:
            # Verify user token
            user_data = self.jwt_service.verify_token(token)
            user_id = user_data['user_id']
            
            # Try to get from cache first
            if cache:
                cached_bookmarks = cache.get_user_bookmarks_cache(user_id)
                if cached_bookmarks:
                    for bookmark in cached_bookmarks:
                        if bookmark.get('file_id') == file_id:
                            return ResponseModel(
                                status=ResponseStatus.SUCCESS,
                                data={"is_bookmarked": True},
                                message='Bookmark status retrieved successfully'
                            )
            
            # Get user
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail='User not found')
            
            # Check if file exists
            file = db.query(File).filter(File.file_id == file_id).first()
            if not file:
                raise HTTPException(status_code=404, detail='File not found')
            
            # Check bookmark status
            is_bookmarked = file in user.bookmarked_files
            
            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data={"is_bookmarked": is_bookmarked},
                message='Bookmark status retrieved successfully'
            )
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error checking bookmark status: {e}")
            raise HTTPException(status_code=500, detail='Failed to check bookmark status') 