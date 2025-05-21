from typing import List

from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from models.course import Course
from schemas.common import ResponseModel, ResponseStatus
from schemas.course import CourseResponse, CourseSearchParams


class CourseCRUD:
    @staticmethod
    def search_courses(
        db: Session, search_params: CourseSearchParams, offset: int = 0, limit: int = 100
    ) -> ResponseModel[List[CourseResponse]]:
        try:
            query = db.query(Course)

            # Apply filters based on search parameters
            if search_params.semester:
                query = query.filter(Course.semester == search_params.semester)
            if search_params.departmentId:
                query = query.filter(Course.departmentId == search_params.departmentId)
            if search_params.serialNumber:
                query = query.filter(Course.serialNumber == search_params.serialNumber)
            if search_params.attributeCode:
                query = query.filter(Course.attributeCode == search_params.attributeCode)
            if search_params.systemCode:
                query = query.filter(Course.systemCode == search_params.systemCode)
            if search_params.forGrade:
                query = query.filter(Course.forGrade == search_params.forGrade)
            if search_params.forClass:
                query = query.filter(Course.forClass == search_params.forClass)
            if search_params.category:
                query = query.filter(Course.category == search_params.category)
            if search_params.courseName:
                query = query.filter(Course.courseName.ilike(f'%{search_params.courseName}%'))
            if search_params.tags:
                query = query.filter(Course.tags.ilike(f'%{search_params.tags}%'))
            if search_params.credits:
                query = query.filter(Course.credits == search_params.credits)
            if search_params.instructors:
                query = query.filter(Course.instructors.ilike(f'%{search_params.instructors}%'))
            if search_params.course_id:
                query = query.filter(Course.course_id == search_params.course_id)

            # Full-text search across multiple fields if search_text is provided
            if search_params.search_text:
                search_term = f'%{search_params.search_text}%'
                query = query.filter(
                    or_(
                        Course.courseName.ilike(search_term),
                        Course.courseNote.ilike(search_term),
                        Course.tags.ilike(search_term),
                        Course.instructors.ilike(search_term),
                        Course.departmentId.ilike(search_term),
                        Course.serialNumber.ilike(search_term),
                    )
                )

            # Apply pagination
            total = query.count()
            courses = query.offset(offset).limit(limit).all()

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[CourseResponse.model_validate(course) for course in courses],
                message=f'Found {total} courses',
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Failed to search courses: {str(e)}')

    @staticmethod
    def get_course_by_id(db: Session, course_id: str) -> ResponseModel[CourseResponse]:
        try:
            course = db.query(Course).filter(Course.course_id == course_id).first()
            if not course:
                raise HTTPException(status_code=404, detail=f'Course with id {course_id} not found')

            return ResponseModel(
                status=ResponseStatus.SUCCESS, data=CourseResponse.model_validate(course)
            )

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Failed to get course: {str(e)}')
