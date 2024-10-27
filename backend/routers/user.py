from fastapi import APIRouter

from crud.user import UserCRUD
from schemas.user import User as UserSchema

router = APIRouter(tags=['user'], prefix='/user')


@router.post('')
async def create_user(user: UserSchema):
    return UserCRUD.create_user(user)


@router.get('')
async def read_all_user():
    return UserCRUD.read_all_user()
