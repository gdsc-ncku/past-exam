from datetime import datetime
from typing import Generic, Literal, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar('T')


class ResponseModel(BaseModel, Generic[T]):
    status: Literal['success', 'error']
    message: Optional[str] = None
    data: Optional[T] = None
    timestamp: datetime = datetime.now()
