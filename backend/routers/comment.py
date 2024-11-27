from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from crud.comment import CommentCRUD
from db.db import get_db
from schemas.comment.main import CommentCreate, CommentResponse
from schemas.common import CommentResponseModel

router = APIRouter(tags=['comment'], prefix='/comment')


@router.post(
    '',
    response_model=CommentResponseModel[CommentResponse],
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new comment',
)
async def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
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
        ###########################################
        error_response = CommentResponseModel(status='error', message=str(e), data=None)

        error_response.timestamp = error_response.timestamp.isoformat()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=error_response.model_dump()
        )
    ############################################


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
                    comment_time=comment.comment_time,
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
        error_response = CommentResponseModel(
            status='error',
            message=str(e),
            data=None,  # No data in error case
        )

        error_response.timestamp = error_response.timestamp.isoformat()

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND, content=error_response.model_dump()
        )


@router.get(
    '/{commenter_id}',
    response_model=CommentResponseModel[List[CommentResponse]],
    status_code=status.HTTP_200_OK,
)
async def read_comment_by_commenter(commenter_id: str, db: Session = Depends(get_db)):
    "in latest order"
    try:
        comments = CommentCRUD.read_comment_by_commenter(commenter_id, db)
        if comments:
            data = [
                CommentResponse(
                    commenter_id=comment.commenter_id,
                    comment_time=comment.comment_time,
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
        error_response = CommentResponseModel(
            status='error',
            message=str(e),
            data=None,  # No data in error case
        )

        error_response.timestamp = error_response.timestamp.isoformat()

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND, content=error_response.model_dump()
        )


@router.delete(
    '/{comment_id}',
    response_model=CommentResponseModel[CommentResponse],
    status_code=status.HTTP_200_OK,
)
async def delete_comment_by_id(comment_id: int, db: Session = Depends(get_db)):
    try:
        comment = CommentCRUD.delete_comment_by_id(comment_id, db)
        if comment:
            data = CommentResponse(
                commenter_id=comment.commenter_id,
                comment_time=comment.comment_time,
                content=comment.content,
                comment_id=comment.comment_id,
            )
            return CommentResponseModel(status='success', message=None, data=data)
        # database exception or no-id exception

    except Exception as e:
        error_response = CommentResponseModel(
            status='error',
            message=str(e),
            data=None,  # No data in error case
        )

        error_response.timestamp = error_response.timestamp.isoformat()

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND, content=error_response.model_dump()
        )
