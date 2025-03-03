from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy.orm import Session

from models.user import User
from schemas.common import ResponseModel, ResponseStatus
from schemas.user import UserCreate as UserCreateSchema
from schemas.user import UserResponse as UserResponseSchema
from schemas.user import UserUpdate as UserUpdateSchema
from services.auth import JWTService


class UserCRUD:
    def __init__(self):
        self.jwt_service = JWTService()

    def get_user_id_from_token(self, token: str) -> str:
        user_info = self.jwt_service.verify_token(token)
        return user_info['user_id']

    def get_or_create_user(
        self,
        db: Session,
        google_user_info: dict,  # dont need token here since user might be login for the first time
    ) -> ResponseModel[UserResponseSchema]:
        try:
            db_user = db.query(User).filter(User.user_id == google_user_info['user_id']).first()

            if not db_user:
                try:
                    user_data = UserCreateSchema(
                        user_id=google_user_info['user_id'],
                        username=google_user_info['username'],
                        email=google_user_info['email'],
                        avatar=google_user_info['avatar'],
                        is_profile_completed=False,
                    )
                except ValidationError as e:
                    raise HTTPException(status_code=400, detail=f'Invalid user data: {str(e)}')

                db_user = User(
                    user_id=user_data.user_id,
                    username=user_data.username,
                    email=user_data.email,
                    avatar=user_data.avatar,
                    is_profile_completed=user_data.is_profile_completed,
                )

                try:
                    db.add(db_user)
                    db.commit()
                    db.refresh(db_user)
                except Exception as e:
                    db.rollback()
                    raise HTTPException(status_code=400, detail=f'Database error: {str(e)}')

            return ResponseModel(
                status=ResponseStatus.SUCCESS, data=UserResponseSchema.model_validate(db_user)
            )
        except HTTPException:
            raise
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f'Failed to get or create user: {str(e)}')

    def get_user_profile(self, db: Session, token: str) -> ResponseModel[UserResponseSchema]:
        try:
            user_id = self.get_user_id_from_token(token)
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail='User not found.')

            return ResponseModel(
                status=ResponseStatus.SUCCESS, data=UserResponseSchema.model_validate(user)
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=400, detail='Failed to get user profile.')

    def update_user_profile(
        self, db: Session, token: str, update_data: UserUpdateSchema
    ) -> ResponseModel[UserResponseSchema]:
        with db.begin():
            user_id = self.get_user_id_from_token(token)
            user = db.query(User).filter(User.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail='User not found')

            update_dict = update_data.model_dump(exclude_unset=True)

            for key, value in update_dict.items():
                setattr(user, key, value)

            if user.username and user.email and user.department:
                user.is_profile_completed = True

            return ResponseModel(
                status=ResponseStatus.SUCCESS, data=UserResponseSchema.model_validate(user)
            )
