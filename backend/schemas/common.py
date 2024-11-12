from typing import Generic, TypeVar, Optional, Literal
from pydantic import BaseModel
from datetime import datetime

T = TypeVar("T")


class ResponseModel(BaseModel, Generic[T]):
    status: Literal["success", "error"]
    message: Optional[str] = None
    data: Optional[T] = None
    timestamp: datetime = datetime.now()