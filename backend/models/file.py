from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, BaseModel

if TYPE_CHECKING:
    from .user import User


class File(Base):
    __tablename__ = 'files'
    file_id: Mapped[BaseModel.int_primary_key]
    filename: Mapped[BaseModel.str_base]
    file_location: Mapped[BaseModel.str_base]
    timestamp: Mapped[BaseModel.timestamp]
    uploader: Mapped['User'] = relationship('User', back_populates='files')
    uploader_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.userId'))

    def __init__(self, filename: str, file_location: str, uploader_id: int):
        self.filename = filename
        self.file_location = file_location
        self.uploader_id = uploader_id
        self.timestamp = datetime.now()

    def __repr__(self):
        return f'File(filename={self.filename}, uploader_id={self.uploader_id})'