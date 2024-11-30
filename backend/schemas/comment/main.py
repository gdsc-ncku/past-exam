from datetime import datetime

from pydantic import BaseModel, Field


class CommentBase(BaseModel):
    commenter_id: str = 'DennisLee03'
    content: str = 'Hello World!'


class CommentCreate(CommentBase):
    """Schema for creating a new comment. Inherits all fields from CommentBase."""

    pass


class CommentResponse(CommentBase):
    comment_id: int = Field(..., gt=0, description='Unique identifier of the comment')
    comment_time: datetime = Field(..., description='timestamp of when the comment was create')
