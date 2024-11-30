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
    def read_all_comment(db: Session, skip: int = 0, limit: int = 10) -> List[Comment]:
        try:
            comments = db.query(Comment).offset(skip).limit(limit).all()
            return comments
        except Exception as e:
            raise e

    @staticmethod
    def read_comment_by_commenter(commenter_id: str, db: Session) -> List[Comment]:
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
    def delete_comment_by_id(comment_id: int, current_user: str, db: Session) -> Comment:
        try:
            comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()

            # the comment doesn't exist
            if comment is None:
                raise Exception(f"comment ID {comment_id} doesn't exist")

            # the comment exists but the user is not the owner
            if comment.commenter_id != current_user:
                raise Exception('You can NOT delete it!')

            db.delete(comment)
            db.commit()
            return comment
        except Exception as e:
            db.rollback()
            raise e
