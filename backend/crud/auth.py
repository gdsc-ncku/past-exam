from fastapi import HTTPException
from pydantic import EmailStr
from sqlalchemy import or_
from sqlalchemy.orm import Session

from core.security import create_access_token, get_password_hash, verify_password
from models.user import User
from schemas.auth import RegisterRequest, TokenResponse
from schemas.common import ResponseModel, ResponseStatus
from schemas.user import UserResponse as UserResponseSchema


class AuthCRUD:
    def authenticate_user(self, db: Session, email: EmailStr, password: str) -> TokenResponse:
        try:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            if not verify_password(password, user.hashed_password):
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            access_token = create_access_token(
                data={"sub": user.email, "user_id": user.user_id}
            )

            return TokenResponse(access_token=access_token)
        
        except HTTPException:
            raise

        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Authentication failed"
            )

    def register_user(
        self, db: Session, user: RegisterRequest
    ) -> ResponseModel[UserResponseSchema]:
        try:
            if db.query(User).filter(
                or_(User.username == user.username, User.email == user.email)
            ).first():
                raise HTTPException(
                    status_code=400,
                    detail="Username or email already exists."
                )
            
            hashed_password = get_password_hash(user.password)

            db_user = User(
                username=user.username,
                hashed_password=hashed_password,
                email=user.email
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

            return ResponseModel(
                status=ResponseStatus.SUCCESS,
                data=UserResponseSchema.model_validate(db_user)
            )
        
        except Exception:
            db.rollback()
            raise HTTPException(status_code=400, detail='Failed to create user.')
