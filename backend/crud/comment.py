from typing import List

from sqlalchemy import desc
from sqlalchemy.orm import Session

from models.comment import Comment
from schemas.comment.main import CommentCreate


class CommentCRUD:
    @staticmethod
    def create_comment(comment: CommentCreate, db: Session) -> Comment:
        if comment.commenter_id == '' or comment.content == '':
            raise ValueError('Neither commenter_id nor content can be EMPTY!')

        try:
            db_comment = Comment(commenter_id=comment.commenter_id, content=comment.content)
            db.add(db_comment)
            db.commit()
            db.refresh(db_comment)
            return db_comment
        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def read_all_comment(db: Session) -> List[Comment]:
        try:
            comments = db.query(Comment).all()
            return comments
        except Exception as e:
            raise e

    @staticmethod
    def read_comment_by_commenter(commenter_id: str, db: Session):
        try:
            comments = (
                db.query(Comment)
                .filter(Comment.commenter_id == commenter_id)
                .order_by(desc(Comment.comment_time))
                .all()
            )
            return comments
        except Exception as e:
            raise e

    @staticmethod
    def delete_comment_by_id(comment_id: int, db: Session):
        try:
            comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
            if comment is None:
                raise Exception(f"comment ID {comment_id} doesn't exist")
            db.delete(comment)
            db.commit()
            return comment
        except Exception as e:
            db.rollback()
            raise e
