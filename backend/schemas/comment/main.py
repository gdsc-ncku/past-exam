from datetime import datetime

from pydantic import BaseModel, Field


class CommentBase(BaseModel):
    commenter_id: str
    content: str


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    comment_id: int = Field(..., gt=0, description='Unique identifier of the comment')
    comment_time: datetime = Field(..., description='timestamp of when the comment was create')
