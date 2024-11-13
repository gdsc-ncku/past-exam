from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.user import UserCRUD
from db.db import get_db
from schemas.user import User as UserSchema

router = APIRouter(tags=['user'], prefix='/user')
user_crud = UserCRUD()


@router.post('')
async def create_user(user: UserSchema, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)


@router.get('')
async def read_all_user(db: Session = Depends(get_db)):
    return user_crud.read_all_user(db)
