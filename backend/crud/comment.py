from sqlalchemy import desc

from db.db import get_db
from models.comment import Comment
from schemas.comment import CommentCreate


class CommentCRUD:
    @staticmethod
    def create_comment(comment: CommentCreate):
        try:
            db = get_db()
            if comment.commenter_id != '' and comment.content != '':
                db_comment = Comment(commenter_id=comment.commenter_id, content=comment.content)
                db.add(db_comment)
                db.commit()
                db.refresh(db_comment)
                db.close()
                return db_comment
            else:
                raise Exception('Neither commenter nor content can be EMPTY!')
        except Exception as e:
            db.rollback()
            db.close()
            raise e

    @staticmethod
    def read_all_comment():
        try:
            db = get_db()
            comments = db.query(Comment).all()
            db.close()
            return comments
        except Exception as e:
            db.rollback()
            db.close()
            raise e

    @staticmethod
    def read_comment_by_commenter(commenter_id: str):
        try:
            db = get_db()
            comments = (
                db.query(Comment)
                .filter(Comment.commenter_id == commenter_id)
                .order_by(desc(Comment.comment_time))
                .all()
            )
            db.close()
            return comments
        except Exception as e:
            db.rollback()
            db.close()
            raise e

    @staticmethod
    def delete_comment_by_id(comment_id: int):
        try:
            db = get_db()
            comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
            if comment is None:
                raise Exception(f"comment ID {comment_id} doesn't exist")
            db.delete(comment)
            db.commit()
            db.close()
            return comment
        except Exception as e:
            db.rollback()
            db.close()
            raise e
