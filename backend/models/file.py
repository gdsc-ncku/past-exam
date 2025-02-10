from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user import User


class File(Base):
    __tablename__ = 'files'

    file_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))
    file_location: Mapped[str] = mapped_column(String(500))
    timestamp: Mapped[datetime] = mapped_column(default=datetime.now)

    uploader_id: Mapped[str] = mapped_column(
        String(50), ForeignKey('users.user_id'), nullable=False
    )

    uploader: Mapped['User'] = relationship(
        'User',  # type: ignore
        back_populates='files',
        lazy='select',
    )

    def __init__(
        self, filename: str, file_location: str, uploader_id: str, file_id: str | None = None
    ):
        self.file_id = file_id
        self.filename = filename
        self.file_location = file_location
        self.uploader_id = uploader_id

    def __repr__(self):
        return f'File(filename={self.filename})'
