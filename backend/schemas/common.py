from datetime import datetime
from enum import Enum
from typing import Generic, Literal, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar('T')


class ResponseStatus(Enum):
    SUCCESS = 'success'
    ERROR = 'error'


class ResponseModel(BaseModel, Generic[T]):
    status: ResponseStatus
    message: Optional[str] = None
    data: Optional[T] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class CommentResponseModel(BaseModel, Generic[T]):
    status: Literal['success', 'error']
    message: Optional[str] = None
    data: Optional[T] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now())
