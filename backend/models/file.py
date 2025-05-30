from datetime import datetime
from typing import TYPE_CHECKING
from enum import Enum

from sqlalchemy import ForeignKey, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .course import Course


class ExamType(str, Enum):
    MIDTERM = "midterm"
    FINAL = "final"
    QUIZ = "quiz"
    HOMEWORK = "homework"
    OTHERS = "others"


class File(Base):
    __tablename__ = 'files'

    file_id: Mapped[str] = mapped_column(String(255), primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))
    file_location: Mapped[str] = mapped_column(String(500))
    timestamp: Mapped[datetime] = mapped_column(default=datetime.now)
    
    # New fields
    exam_type: Mapped[ExamType] = mapped_column(String(50), default=ExamType.OTHERS)
    info: Mapped[str] = mapped_column(String(1000), nullable=True)
    anonymous: Mapped[bool] = mapped_column(Boolean, default=False)

    user_id: Mapped[str] = mapped_column(String(255), ForeignKey('users.user_id'), nullable=False)
    course_id: Mapped[str] = mapped_column(String(50), ForeignKey('courses.course_id'), nullable=True)

    uploader: Mapped['User'] = relationship(
        'User',  # type: ignore
        back_populates='files',
        lazy='select',
    )
    
    course: Mapped['Course'] = relationship(
        'Course',  # type: ignore
        back_populates='files',
        lazy='select',
    )

    def __init__(self, filename: str, file_location: str, user_id: str, file_id: str | None = None, course_id: str | None = None, exam_type: ExamType = ExamType.OTHERS, info: str | None = None, anonymous: bool = False):
        self.file_id = file_id
        self.filename = filename
        self.file_location = file_location
        self.user_id = user_id
        self.course_id = course_id
        self.exam_type = exam_type
        self.info = info
        self.anonymous = anonymous

    def __repr__(self):
        return f'File(filename={self.filename})'
