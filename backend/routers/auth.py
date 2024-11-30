from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.auth import AuthCRUD
from db.db import get_db
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from schemas.common import ResponseModel
from schemas.user import UserResponse as UserResponseSchema

router = APIRouter(tags=['auth'], prefix='/auth')
auth_crud = AuthCRUD()


@router.post('/login', response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    return auth_crud.authenticate_user(db, login_data.email, login_data.password)


@router.post('/register', response_model=ResponseModel[UserResponseSchema])
async def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
) -> UserResponseSchema:
    return auth_crud.register_user(db, register_data)

