from datetime import datetime

from sqlalchemy.orm import Mapped

from .base import Base, BaseModel


class Comment(Base):
    __tablename__ = 'Comments'

    comment_id: Mapped[BaseModel.int_primary_key]
    commenter_id: Mapped[BaseModel.str_base]
    content: Mapped[BaseModel.str_base]
    comment_time: Mapped[BaseModel.timestamp]

    def __init__(self, commenter_id: str, content: str):
        # empty str validation exception is in CommentCRUD's create
        self.commenter_id = commenter_id
        self.content = content
        self.comment_time = datetime.now()

    def __repr__(self):
        return (
            f'Comment(commenter_id={self.commenter_id}, '
            f'comment={self.content}, '
            f'comment_time={self.comment_time})'
        )
