from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from crud.comment import CommentCRUD
from db.db import get_db
from schemas.comment.main import CommentCreate, CommentResponse
from schemas.common import CommentResponseModel
from utils.comment import error_response

router = APIRouter(tags=['comment'], prefix='/api/v1/comment')


@router.post(
    '',
    response_model=CommentResponseModel[CommentResponse],
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new comment',
)
async def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    # TODO: restrict characters of commenter_id
    try:
        db_comment = CommentCRUD.create_comment(comment, db)

        data = CommentResponse(
            commenter_id=db_comment.commenter_id,
            comment_time=db_comment.comment_time.isoformat(),
            content=db_comment.content,
            comment_id=db_comment.comment_id,
        )
        return CommentResponseModel(status='success', message=None, data=data)

    except Exception as e:
        return error_response(e=e, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get(
    '', response_model=CommentResponseModel[List[CommentResponse]], status_code=status.HTTP_200_OK
)
async def read_all_comment(db: Session = Depends(get_db)):
    try:
        comments = CommentCRUD.read_all_comment(db)
        if comments:
            data = [
                CommentResponse(
                    commenter_id=comment.commenter_id,
                    comment_time=comment.comment_time.isoformat(),
                    content=comment.content,
                    comment_id=comment.comment_id,
                )
                for comment in comments
            ]
            return CommentResponseModel(status='success', message=None, data=data)
        else:
            raise Exception('No comments found')
        # database exception or no-comment exception

    except Exception as e:
        return error_response(e=e, status_code=status.HTTP_404_NOT_FOUND)


@router.get(
    '/{commenter_id}',
    response_model=CommentResponseModel[List[CommentResponse]],
    status_code=status.HTTP_200_OK,
)
async def read_comment_by_commenter(commenter_id: str, db: Session = Depends(get_db)):
    """
    Retrieve comments by commenter ID

    Returns comments in descending order of comment time
    """
    try:
        comments = CommentCRUD.read_comment_by_commenter(commenter_id, db)
        if comments:
            data = [
                CommentResponse(
                    commenter_id=comment.commenter_id,
                    comment_time=comment.comment_time.isoformat(),
                    content=comment.content,
                    comment_id=comment.comment_id,
                )
                for comment in comments
            ]
            return CommentResponseModel(status='success', message=None, data=data)
        else:
            raise Exception(f'No comments of {commenter_id} found')
        # database exception or no-commenter exception

    except Exception as e:
        return error_response(e=e, status_code=status.HTTP_404_NOT_FOUND)


@router.delete(
    '/{comment_id}',
    response_model=CommentResponseModel[CommentResponse],
    status_code=status.HTTP_200_OK,
)
async def delete_comment_by_id(comment_id: int, current_user: str, db: Session = Depends(get_db)):
    # TODO: validate commenter_id to determine deleting or not
    try:
        comment = CommentCRUD.delete_comment_by_id(comment_id, current_user, db)
        if comment:
            data = CommentResponse(
                commenter_id=comment.commenter_id,
                comment_time=comment.comment_time.isoformat(),
                content=comment.content,
                comment_id=comment.comment_id,
            )
            return CommentResponseModel(status='success', message=None, data=data)
        # database exception or no-id exception

    except Exception as e:
        return error_response(e=e, status_code=status.HTTP_403_FORBIDDEN)
