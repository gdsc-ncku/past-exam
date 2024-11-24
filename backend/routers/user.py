from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.user import UserCRUD
from db.db import get_db
from schemas.common import ResponseModel
from schemas.user import UserCreate as UserCreateSchema
from schemas.user import UserResponse as UserResponseSchema

router = APIRouter(tags=['user'], prefix='/user')
user_crud = UserCRUD()


@router.post('', response_model=ResponseModel[UserResponseSchema])
async def create_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)


@router.get('', response_model=ResponseModel[List[UserResponseSchema]])
async def read_all_user(db: Session = Depends(get_db)):
    return user_crud.read_all_user(db)
