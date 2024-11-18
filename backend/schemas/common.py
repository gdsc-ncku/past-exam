from datetime import datetime
from typing import Generic, Literal, Optional, TypeVar, Union

from pydantic import BaseModel

T = TypeVar('T')


class CommentResponseModel(BaseModel, Generic[T]):
    status: Literal['success', 'error']
    message: Optional[str] = None
    data: Optional[T] = None
    timestamp: Union[datetime, str] = datetime.now()

    class Config:
        json_schema_extra = {
            'example': {
                'status': 'success',
                'message': None,
                'data': {
                    'comment_id': 1,
                    'commenter_id': 'dennislee03',
                    'content': 'Hello World!',
                    'comment_time': '2024-11-18T03:18:41.691Z',
                },
                'timestamp': '2024-11-18T13:42:22.308579',
            }
        }
