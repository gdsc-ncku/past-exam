from datetime import datetime
from enum import Enum
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar('T')

class ResponseStatus(Enum):
    SUCCESS = "success"
    ERROR = "error"

class ResponseModel(BaseModel, Generic[T]):
    status: ResponseStatus
    message: Optional[str] = None
    data: Optional[T] = None
    timestamp: datetime = Field(default_factory=datetime.now)