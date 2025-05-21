from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from crud.course import CourseCRUD
from db.db import get_db
from schemas.common import ResponseModel
from schemas.course import CourseResponse, CourseSearchParams

router = APIRouter(tags=['course'], prefix='/api/v1/course')
course_crud = CourseCRUD()


@router.get('/search', response_model=ResponseModel[List[CourseResponse]])
async def search_courses(
    search_params: CourseSearchParams = Depends(),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Search courses with various filters and full-text search capability.

    Parameters:
    - All fields from CourseSearchParams are optional and can be used as filters
    - search_text: Optional full-text search across course name, note, tags, instructors, etc.
    - offset: Number of records to skip (for pagination)
    - limit: Maximum number of records to return (for pagination)
    """
    return course_crud.search_courses(db, search_params, offset, limit)


@router.get('/{course_id}', response_model=ResponseModel[CourseResponse])
async def get_course(course_id: str, db: Session = Depends(get_db)):
    """
    Get a specific course by its ID.
    """
    return course_crud.get_course_by_id(db, course_id)
