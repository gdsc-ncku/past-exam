from datetime import datetime
from enum import Enum
from typing import Generic, Literal, Optional, TypeVar, Union

from pydantic import BaseModel, Field

from schemas.comment.example import CommentConfig

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
    # TODO: adjust timestamp
    timestamp: Union[datetime, str] = datetime.now()

    class Config:
        # TODO: keys automatic sorting
        json_encoder = CommentConfig.json_encoders
        json_sort_keys = False
        json_schema_extra = {'example': CommentConfig.RESPONSE_MODEL_EXAMPLE}
