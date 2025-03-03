from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    username: str
    email: EmailStr
    avatar: Optional[str] = None
    department: Optional[str] = None
    is_profile_completed: bool = False


class UserCreate(UserBase):
    user_id: str


class UserResponse(UserBase):
    user_id: str
    timestamp: datetime


class UserUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    department: Optional[str] = None
