from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .file import File


class User(Base):
    __tablename__ = 'users'

    user_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    username: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(320))
    timestamp: Mapped[datetime] = mapped_column(default=datetime.now)
    avatar: Mapped[str] = mapped_column(String(500), nullable=True)
    is_profile_completed: Mapped[bool] = mapped_column(default=False)
    department: Mapped[str] = mapped_column(String(100), nullable=True)

    files: Mapped[list['File']] = relationship(
        'File',  # type: ignore
        back_populates='uploader',
        cascade='all, delete-orphan',
        lazy='select',
        order_by='File.filename',
    )

    def __init__(
        self,
        user_id: str,
        username: str,
        email: EmailStr,
        avatar: str | None = None,
        is_profile_completed: bool = False,
        department: str | None = None,
    ):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.avatar = avatar
        self.is_profile_completed = is_profile_completed
        self.timestamp = datetime.now()
        self.files = []
        self.department = department

    def __repr__(self):
        return f'User(username={self.username}, email={self.email})'
