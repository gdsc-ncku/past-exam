from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Course(Base):
    __tablename__ = 'courses'

    semester: Mapped[str] = mapped_column(String(50))
    departmentId: Mapped[str] = mapped_column(String(50))
    serialNumber: Mapped[str] = mapped_column(String(50))
    attributeCode: Mapped[str] = mapped_column(String(50))
    systemCode: Mapped[str] = mapped_column(String(50))
    forGrade: Mapped[str] = mapped_column(String(50))
    forClass: Mapped[str] = mapped_column(String(50))
    category: Mapped[str] = mapped_column(String(50))
    courseName: Mapped[str] = mapped_column(String(200))
    courseNote: Mapped[str] = mapped_column(String(500))
    tags: Mapped[str] = mapped_column(String(200))
    credits: Mapped[str] = mapped_column(String(50))
    instructors: Mapped[str] = mapped_column(String(200))
    course_id: Mapped[str] = mapped_column(String(50), primary_key=True)

    def __repr__(self):
        return f'Course(course_id={self.course_id}, courseName={self.courseName})'
