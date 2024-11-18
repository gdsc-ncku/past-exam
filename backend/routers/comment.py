from typing import List

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from crud.comment import CommentCRUD
from schemas.comment import CommentCreate, CommentResponse
from schemas.common import CommentResponseModel
from utils.comment import serialize_datetime as ser

router = APIRouter(tags=['comment'], prefix='/comment')


@router.post(
    '',
    response_model=CommentResponseModel[CommentResponse],
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new comment',
)
async def create_comment(comment: CommentCreate):
    try:
        db_comment = CommentCRUD.create_comment(comment)
        data = CommentResponse(
            commenter_id=db_comment.commenter_id,
            comment_time=db_comment.comment_time,
            content=db_comment.content,
            comment_id=db_comment.comment_id,
        )
        return CommentResponseModel(status='success', message=None, data=data)
    except Exception as e:
        error_response = CommentResponseModel(
            status='error',
            message=str(e),
            data=None,  # No data in error case
        )

        if error_response and hasattr(error_response, 'timestamp'):
            error_response.timestamp = ser(error_response.timestamp)

        # You can control the status code here
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,  # or any other status you want
            content=error_response.model_dump(),  # Convert the response model to a dictionary
        )


@router.get('', response_model=List[CommentResponse], status_code=status.HTTP_200_OK)
async def read_all_comment():
    comments = CommentCRUD.read_all_comment()
    if comments:
        return [
            CommentResponse(
                commenter_id=comment.commenter_id,
                comment_time=comment.comment_time,
                content=comment.content,
                comment_id=comment.comment_id,
            )
            for comment in comments
        ]
    else:
        raise HTTPException(status_code=404, detail='No comments found')


@router.get('/{commenter_id}', response_model=List[CommentResponse], status_code=status.HTTP_200_OK)
async def read_comment_by_commenter(commenter_id: str):
    "latest"
    comments = CommentCRUD.read_comment_by_commenter(commenter_id)
    if comments:
        return [
            CommentResponse(
                commenter_id=comment.commenter_id,
                comment_time=comment.comment_time,
                content=comment.content,
                comment_id=comment.comment_id,
            )
            for comment in comments
        ]
    else:
        raise HTTPException(status_code=404, detail=f'No comments of {commenter_id} found')


@router.delete('/{comment_id}', response_model=CommentResponse, status_code=status.HTTP_200_OK)
async def delete_comment_by_id(comment_id: int):
    comment = CommentCRUD.delete_comment_by_id(comment_id)
    if comment:
        return CommentResponse(
            commenter_id=comment.commenter_id,
            comment_time=comment.comment_time,
            content=comment.content,
            comment_id=comment.comment_id,
        )
    else:
        raise HTTPException(status_code=404, detail=f"comment ID {comment_id} doesn't exist")
