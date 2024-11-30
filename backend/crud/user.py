from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.user import User
from schemas.common import ResponseModel, ResponseStatus
from schemas.user import UserResponse as UserResponseSchema


class UserCRUD:
    def read_all_user(self, db: Session) -> ResponseModel[List[UserResponseSchema]]:
        try:
            users = db.query(User).all()

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=[UserResponseSchema.model_validate(user) for user in users],
            )
        except Exception:
            raise HTTPException(status_code=400, detail='Failed to read all users.')
