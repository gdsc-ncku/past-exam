from datetime import datetime

from pydantic import BaseModel


class CommentBase(BaseModel):
    commenter_id: str
    content: str


class CommentCreate(CommentBase):
    class Config:
        json_schema_extra = {'example': {'commenter_id': 'dennislee03', 'content': 'Hello World!'}}


class CommentResponse(CommentBase):
    comment_id: int
    comment_time: datetime

    class Config:
        json_schema_extra = {
            'example': {
                'commenter_id': 'dennislee03',
                'content': 'Hello World!',
                'comment_id': '17',
                'comment_time': '2024-11-18T03:18:41.691Z',
            }
        }
