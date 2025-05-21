from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class CourseBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    semester: str
    departmentId: str
    serialNumber: str
    attributeCode: str
    systemCode: str
    forGrade: str
    forClass: str
    category: str
    courseName: str
    courseNote: str
    tags: str
    credits: str
    instructors: str
    course_id: str


class CourseResponse(CourseBase):
    pass


class CourseSearchParams(BaseModel):
    semester: Optional[str] = None
    departmentId: Optional[str] = None
    serialNumber: Optional[str] = None
    attributeCode: Optional[str] = None
    systemCode: Optional[str] = None
    forGrade: Optional[str] = None
    forClass: Optional[str] = None
    category: Optional[str] = None
    courseName: Optional[str] = None  # Exact match
    courseNameSearch: Optional[str] = None  # Fuzzy search for course name
    tags: Optional[str] = None
    credits: Optional[str] = None
    instructors: Optional[str] = None
    course_id: Optional[str] = None
    search_text: Optional[str] = None  # For full-text search across multiple fields
