from typing import List

from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from models.user import User
from schemas.common import ResponseModel, ResponseStatus
from schemas.user import UserCreate as UserCreateSchema
from schemas.user import UserResponse as UserResponseSchema


class UserCRUD:
    def create_user(self, db: Session, user: UserCreateSchema) -> ResponseModel[UserResponseSchema]:
        try:
            if (
                db.query(User)
                .filter(or_(User.username == user.username, User.email == user.email))
                .first()
            ):
                raise HTTPException(status_code=400, detail='Username or email already exists.')

            db_user = User(username=user.username, password=user.password, email=user.email)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

            return ResponseModel(
                status=ResponseStatus.SUCCESS, data=UserResponseSchema.model_validate(db_user)
            )

        except Exception:
            db.rollback()
            raise HTTPException(status_code=400, detail='Failed to create user.')

    def read_all_user(self, db: Session) -> ResponseModel[List[UserResponseSchema]]:
        try:
            users = db.query(User).all()

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[UserResponseSchema.model_validate(user) for user in users],
            )
        except Exception:
            raise HTTPException(status_code=400, detail='Failed to read all users.')
