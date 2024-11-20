from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlalchemy.orm import Mapped, relationship

from .base import Base, BaseModel

if TYPE_CHECKING:
    from .file import File


class User(Base):
    __tablename__ = 'users'
    user_id: Mapped[BaseModel.int_primary_key]
    username: Mapped[BaseModel.str_base]
    password: Mapped[BaseModel.str_base]
    email: Mapped[BaseModel.str_base]
    timestamp: Mapped[BaseModel.timestamp]
    files: Mapped[list['File']] = relationship(
        'File',  # type: ignore
        back_populates='uploader',
        cascade='all, delete-orphan',
        lazy='select',
        order_by='File.filename',
    )

    def __init__(self, username: str, password: str, email: EmailStr):
        self.username = username
        self.password = password
        self.email = email
        self.timestamp = datetime.now()
        self.files = []

    def __repr__(self):
        return f'User(username={self.username}, email={self.email})'
