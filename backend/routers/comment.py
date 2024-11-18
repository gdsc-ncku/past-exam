from typing import List

from fastapi import APIRouter, HTTPException, status

from crud.comment import CommentCRUD
from schemas.comment import CommentCreate, CommentResponse

router = APIRouter(tags=['comment'], prefix='/comment')


@router.post(
    '',
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new comment',
)
async def create_comment(comment: CommentCreate):
    try:
        db_comment = CommentCRUD.create_comment(comment)
        return CommentResponse(
            commenter_id=db_comment.commenter_id,
            comment_time=db_comment.comment_time,
            content=db_comment.content,
            comment_id=db_comment.comment_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'An error occurred: {str(e)}')


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
