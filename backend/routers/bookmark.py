from typing import List

from fastapi import APIRouter, Cookie, Depends, Header
from sqlalchemy.orm import Session

from crud.bookmark import BookmarkCRUD
from db.db import get_db
from schemas.common import ResponseModel
from schemas.file import FileResponse as FileResponseSchema
from core.dependencies import get_cache
from services.cache import CacheService

router = APIRouter(tags=['bookmark'], prefix='/api/v1/bookmark')

bookmark_crud = BookmarkCRUD()


@router.post('/{file_id}', response_model=ResponseModel[None])
async def add_bookmark(
    file_id: str,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
    cache: CacheService = Depends(get_cache),
):
    """Add a file to user's bookmarks"""
    return bookmark_crud.add_bookmark(db, token, file_id, cache)


@router.delete('/{file_id}', response_model=ResponseModel[None])
async def remove_bookmark(
    file_id: str,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
    cache: CacheService = Depends(get_cache),
):
    """Remove a file from user's bookmarks"""
    return bookmark_crud.remove_bookmark(db, token, file_id, cache)


@router.get('', response_model=ResponseModel[List[FileResponseSchema]])
async def get_bookmarks(
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
    cache: CacheService = Depends(get_cache),
):
    """Get all bookmarked files for the current user"""
    return bookmark_crud.get_bookmarks(db, token, cache)


@router.get('/{file_id}/status', response_model=ResponseModel[dict])
async def check_bookmark_status(
    file_id: str,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
    cache: CacheService = Depends(get_cache),
):
    """Check if a file is bookmarked by the current user"""
    return bookmark_crud.check_bookmark_status(db, token, file_id, cache) 